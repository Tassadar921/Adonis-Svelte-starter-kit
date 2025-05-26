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

@inject()
export default class AuthController {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly mailService: BrevoMailService
    ) {}

    public async login({ request, response }: HttpContext): Promise<void> {
        try {
            const { email, password } = await request.validateUsing(loginValidator);

            const user: User = await User.verifyCredentials(email, password);
            await user.load('profilePicture');

            const token: AccessToken = await User.accessTokens.create(user);

            return response.send({
                message: 'Logged in',
                token,
                user: user.apiSerialize(),
            });
        } catch (error: any) {
            return response.unauthorized({ error: 'API Login failed' });
        }
    }

    public async logout({ auth, response }: HttpContext): Promise<void> {
        const user: User & { currentAccessToken: AccessToken } = await auth.use('api').authenticate();
        await User.accessTokens.delete(user, user.currentAccessToken.identifier);

        return response.send({ message: 'Logged out' });
    }

    public async sendAccountCreationEmail({ request, response, language }: HttpContext): Promise<void> {
        const { username, email, password, consent } = await request.validateUsing(sendAccountCreationEmailValidator);

        if (!consent) {
            return response.badRequest({ error: 'Consent is required' });
        }

        let user: User | null = await this.userRepository.findOneBy({ email });
        if (user) {
            if (!user.enabled) {
                if (user.createdAt > DateTime.now().minus({ minutes: 5 })) {
                    return response.send({ message: 'Check your mails to confirm account creation' });
                } else {
                    await user.delete();
                }
            } else {
                return response.status(409).send({ error: 'User already exists' });
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
            return response.badGateway({ error: 'Failed to send account creation email' });
        }

        return response.send({ message: 'Check your mails to confirm account creation' });
    }

    public async confirmAccountCreation({ request, response }: HttpContext): Promise<void> {
        const { token } = await confirmAccountCreationValidator.validate(request.params());

        const user: User = await this.userRepository.firstOrFail({ creationToken: token });

        user.enabled = true;
        user.creationToken = null;
        await user.save();

        const accessToken: AccessToken = await User.accessTokens.create(user);

        return response.send({ message: 'Account successfully enabled', token: accessToken, user: user.apiSerialize() });
    }
}
