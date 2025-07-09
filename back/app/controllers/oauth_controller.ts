import { HttpContext } from '@adonisjs/core/http';
import { GithubDriver } from '@adonisjs/ally/drivers/github';
import { DiscordDriver } from '@adonisjs/ally/drivers/discord';
import { GoogleDriver } from '@adonisjs/ally/drivers/google';
import FileService from '#services/file_service';
import { inject } from '@adonisjs/core';
import app from '@adonisjs/core/services/app';
import File from '#models/file';
import User from '#models/user';
import UserRoleEnum from '#types/enum/user_role_enum';
import env from '#start/env';
import UserRepository from '#repositories/user_repository';
import { I18n } from '@adonisjs/i18n';
import FileTypeEnum from '#types/enum/file_type_enum';
import { cuid } from '@adonisjs/core/helpers';
import { confirmOauthConnectionValidator } from '#validators/oauth';
import { AccessToken } from '@adonisjs/auth/access_tokens';
import StringService from '#services/string_service';

@inject()
export default class OauthController {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly fileService: FileService,
        private readonly stringService: StringService
    ) {}

    public async github({ ally }: HttpContext): Promise<void> {
        return ally.use('github').redirect();
    }

    public async githubCallback({ ally, response, i18n }: HttpContext) {
        const client: GithubDriver = ally.use('github');
        const { error, token } = await this.handleCallback(client, i18n);
        if (error) {
            return response.badRequest({ error });
        }

        return response.redirect(`${env.get('FRONT_URI')}/en/oauth?token=${token}&provider=github`);
    }

    public async discord({ ally }: HttpContext): Promise<void> {
        return ally.use('discord').redirect();
    }

    public async discordCallback({ ally, response, i18n }: HttpContext) {
        const client: DiscordDriver = ally.use('discord');
        const { error, token } = await this.handleCallback(client, i18n);
        if (error) {
            return response.badRequest({ error });
        }

        return response.redirect(`${env.get('FRONT_URI')}/en/oauth?token=${token}&provider=discord`);
    }

    public async google({ ally }: HttpContext): Promise<void> {
        return ally.use('google').redirect();
    }

    public async googleCallback({ ally, response, i18n }: HttpContext) {
        const client: GoogleDriver = ally.use('google');
        const { error, token } = await this.handleCallback(client, i18n);
        if (error) {
            return response.badRequest({ error });
        }

        console.log(`${env.get('FRONT_URI')}/en/oauth?token=${token}`);

        return response.redirect(`${env.get('FRONT_URI')}/en/oauth?token=${token}&provider=google`);
    }

    public async confirmOauthConnection({ request, response, i18n }: HttpContext) {
        const { provider, token: creationToken } = await confirmOauthConnectionValidator.validate(request.params());

        const user: User | null = await this.userRepository.findOneBy({ token: creationToken });
        if (!user) {
            return response.notFound({ error: i18n.t('messages.oauth.confirm.error') });
        }

        user.token = null;
        await user.save();

        const token: AccessToken = await User.accessTokens.create(user);

        return response.ok({
            message: i18n.t('messages.oauth.confirm.success', { provider: this.stringService.capitalize(provider) }),
            token,
            user: user.apiSerialize(),
        });
    }

    private async handleCallback(client: GithubDriver | DiscordDriver | GoogleDriver, i18n: I18n): Promise<{ error?: string; token?: string }> {
        /**
         * User has denied access by canceling
         * the login flow
         */
        if (client.accessDenied()) {
            return { error: i18n.t('messages.oauth.callback.error.access-denied') };
        }

        /**
         * OAuth state verification failed. This happens when the
         * CSRF cookie gets expired.
         */
        if (client.stateMisMatch()) {
            return { error: i18n.t('messages.oauth.callback.error.state-mismatch') };
        }

        /**
         * Client responded with some error
         */
        if (client.hasError()) {
            return { error: client.getError() ?? i18n.t('messages.oauth.callback.error.default') };
        }

        const oauthUser = await client.user();
        let user: User | null = await this.userRepository.findOneBy({ email: oauthUser.email });
        if (user) {
            if (!user.isOauth) {
                user.isOauth = true;
            }

            if (oauthUser.avatarUrl && !user.profilePictureId) {
                const profilePicture: File = await this.storeAndGetFileFromUrl(oauthUser.avatarUrl);
                user.profilePictureId = profilePicture.id;
            }

            const token: string = cuid();

            user.token = token;
            user.isOauth = true;
            await user.save();

            return { token };
        }

        let profilePicture: File | null = null;

        if (oauthUser.avatarUrl) {
            profilePicture = await this.storeAndGetFileFromUrl(oauthUser.avatarUrl);
        }

        const token: string = cuid();

        await User.create({
            username: oauthUser.nickName,
            email: oauthUser.email,
            isOauth: true,
            profilePictureId: profilePicture?.id,
            enabled: true,
            acceptedTermsAndConditions: true,
            role: UserRoleEnum.USER,
            token,
        });

        return { token };
    }

    private async storeAndGetFileFromUrl(url: string): Promise<File> {
        const profilePicturePath: string = await this.fileService.saveOauthProfilePictureFromUrl(url);
        const { size, mimeType, extension, name } = await this.fileService.getFileInfo(app.makePath(profilePicturePath));

        const profilePicture: File | null = await File.create({
            name,
            path: profilePicturePath,
            extension,
            mimeType,
            size,
            type: FileTypeEnum.PROFILE_PICTURE,
        });

        return await profilePicture.refresh();
    }
}
