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
import { randomUUID } from 'node:crypto';
import { Response } from '@adonisjs/core/http';

@inject()
export default class AuthController {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly mailService: BrevoMailService
    ) {}

    public async login({ request, response, i18n }: HttpContext): Promise<void> {
        try {
            const { email, password } = await request.validateUsing(loginValidator);
            console.log(email, password);

            const user: User = await User.verifyCredentials(email, password);
            await user.load('profilePicture');

            console.log(user);

            response = await this.setAccessToken(user, response);

            return response.send({
                message: i18n.t('messages.auth.login.success'),
                user: user.apiSerialize(),
            });
        } catch (error: any) {
            console.log(error)
            return response.unauthorized({ error: i18n.t('messages.auth.login.error') });
        }
    }

    public async logout({ auth, response, i18n }: HttpContext): Promise<void> {
        const user: User & { currentAccessToken: AccessToken } = await auth.use('api').authenticate();
        await User.accessTokens.delete(user, user.currentAccessToken.identifier);

        response.clearCookie('apiToken');

        return response.send({ message: i18n.t('messages.auth.logout.success') });
    }

    public async sendAccountCreationEmail({ request, response, language, i18n }: HttpContext): Promise<void> {
        const { username, email, password, consent } = await request.validateUsing(sendAccountCreationEmailValidator);

        if (!consent) {
            return response.badRequest({ error: i18n.t('messages.auth.send-account-creation-email.error.consent-required') });
        }

        let user: User | null = await this.userRepository.findOneBy({ email });
        if (user) {
            if (!user.enabled) {
                if (user.createdAt > DateTime.now().minus({ minutes: 5 })) {
                    return response.send({ message: i18n.t('messages.auth.send-account-creation-email.success') });
                } else {
                    await user.delete();
                }
            } else {
                return response.status(409).send({ error: i18n.t('messages.auth.send-account-creation-email.error.email-already-in-use') });
            }
        }

        try {
            const token: string = randomUUID();
            await this.mailService.sendAccountCreationEmail(email, `${env.get('FRONT_URI')}/${language.code}/create-account/confirm/${token}`);
            await User.create({
                username,
                email,
                password,
                role: UserRoleEnum.USER,
                creationToken: token,
                acceptedTermsAndConditions: true,
            });
        } catch (error: any) {
            return response.badGateway({ error: i18n.t('messages.auth.send-account-creation-email.error.mail-not-sent') });
        }

        return response.send({ message: i18n.t('messages.auth.send-account-creation-email.success') });
    }

    public async confirmAccountCreation({ request, response, i18n }: HttpContext): Promise<void> {
        const { token } = await confirmAccountCreationValidator.validate(request.params());

        const user: User | null = await this.userRepository.findOneBy({ creationToken: token });
        if (!user) {
            return response.notFound({ error: i18n.t('messages.auth.confirm-account-creation.invalid-token') });
        } else if (user.createdAt > DateTime.now().minus({ minutes: 5 })) {
            return response.badRequest({ error: i18n.t('messages.auth.confirm-account-creation.token-expired') });
        }

        user.enabled = true;
        user.creationToken = null;
        await user.save();

        response = await this.setAccessToken(user, response);

        return response.send({
            message: i18n.t('messages.auth.confirm-account-creation.success'),
            user: user.apiSerialize(),
        });
    }

    private async setAccessToken(user: User, response: Response): Promise<Response> {
        console.log('ici')
        const accessToken: AccessToken = await User.accessTokens.create(user);

        if (!accessToken.expiresAt) {
            throw new Error();
        }

        const expiresAt: Date = new Date(accessToken.expiresAt);
        const now: Date = new Date();

        console.log('là', accessToken)

        response.cookie('apiToken', accessToken.value!.release(), {
            maxAge: Math.floor((expiresAt.getTime() - now.getTime()) / 1000),
        });

        console.log(accessToken);

        return response;
    }
}
