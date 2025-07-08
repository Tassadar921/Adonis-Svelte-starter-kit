import { HttpContext } from '@adonisjs/core/http';
import User from '#models/user';
import { AccessToken } from '@adonisjs/auth/access_tokens';
import { inject } from '@adonisjs/core';
import UserRoleEnum from '#types/enum/user_role_enum';
import { DateTime } from 'luxon';
import UserRepository from '#repositories/user_repository';
import { loginValidator, sendAccountCreationEmailValidator, confirmAccountCreationValidator } from '#validators/auth';
import BrevoMailService from '#services/brevo_mail_service';
import env from '#start/env';
import { cuid } from '@adonisjs/core/helpers';

@inject()
export default class AuthController {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly mailService: BrevoMailService
    ) {}

    public async login({ request, response, i18n }: HttpContext) {
        try {
            const { email, password } = await request.validateUsing(loginValidator);

            const user: User = await User.verifyCredentials(email, password);
            await user.load('profilePicture');

            const token: AccessToken = await User.accessTokens.create(user);

            return response.ok({
                message: i18n.t('messages.auth.login.success'),
                token,
                user: user.apiSerialize(),
            });
        } catch (error: any) {
            return response.unauthorized({ error: i18n.t('messages.auth.login.error') });
        }
    }

    public async logout({ auth, response, i18n }: HttpContext) {
        const user: User & { currentAccessToken: AccessToken } = await auth.use('api').authenticate();
        await User.accessTokens.delete(user, user.currentAccessToken.identifier);

        return response.ok({ message: i18n.t('messages.auth.logout.success') });
    }

    public async sendAccountCreationEmail({ request, response, language, i18n }: HttpContext) {
        const { username, email, password, consent } = await request.validateUsing(sendAccountCreationEmailValidator);

        if (!consent) {
            return response.badRequest({ error: i18n.t('messages.auth.send-account-creation-email.error.consent-required') });
        }

        let user: User | null = await this.userRepository.findOneBy({ email });
        if (user) {
            if (!user.enabled) {
                if (user.createdAt > DateTime.now().minus({ minutes: 5 })) {
                    return response.ok({ message: i18n.t('messages.auth.send-account-creation-email.success') });
                } else {
                    await user.delete();
                }
            } else {
                return response.conflict({ error: i18n.t('messages.auth.send-account-creation-email.error.email-already-in-use') });
            }
        }

        try {
            const token: string = cuid();
            await this.mailService.sendAccountCreationEmail(email, `${env.get('FRONT_URI')}/${language.code}/create-account/confirm/${token}`);
            await User.create({
                username,
                email,
                password,
                role: UserRoleEnum.USER,
                token,
                acceptedTermsAndConditions: true,
            });
        } catch (error: any) {
            return response.badGateway({ error: i18n.t('messages.auth.send-account-creation-email.error.mail-not-sent') });
        }

        return response.ok({ message: i18n.t('messages.auth.send-account-creation-email.success') });
    }

    public async confirmAccountCreation({ request, response, i18n }: HttpContext) {
        const { token: creationToken } = await confirmAccountCreationValidator.validate(request.params());

        const user: User | null = await this.userRepository.findOneBy({ token: creationToken });
        if (!user) {
            return response.notFound({ error: i18n.t('messages.auth.confirm-account-creation.invalid-token') });
        } else if (user.createdAt > DateTime.now().minus({ minutes: 5 })) {
            return response.badRequest({ error: i18n.t('messages.auth.confirm-account-creation.token-expired') });
        }

        user.enabled = true;
        user.token = null;
        await user.save();

        const token: AccessToken = await User.accessTokens.create(user);

        return response.ok({
            message: i18n.t('messages.auth.confirm-account-creation.success'),
            token,
            user: user.apiSerialize(),
        });
    }
}
