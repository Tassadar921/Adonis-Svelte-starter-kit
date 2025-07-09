import { HttpContext } from '@adonisjs/core/http';
import UserRepository from '#repositories/user_repository';
import ResetPasswordRepository from '#repositories/reset_password_repository';
import BrevoMailService from '#services/brevo_mail_service';
import User from '#models/user';
import ResetPassword from '#models/reset_password';
import crypto from 'crypto';
import { DateTime } from 'luxon';
import { inject } from '@adonisjs/core';
import File from '#models/file';
import app from '@adonisjs/core/services/app';
import { cuid } from '@adonisjs/core/helpers';
import FileService from '#services/file_service';
import SlugifyService from '#services/slugify_service';
import { resetPasswordParamsValidator, resetPasswordValidator, sendResetPasswordEmailValidator, updateProfileValidator } from '#validators/profile';
import path from 'node:path';
import env from '#start/env';
import FileTypeEnum from '#types/enum/file_type_enum';
import cache from '@adonisjs/cache/services/main';

@inject()
export default class ProfileController {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly resetPasswordRepository: ResetPasswordRepository,
        private readonly mailService: BrevoMailService,
        private readonly fileService: FileService,
        private readonly slugifyService: SlugifyService
    ) {}

    public async getProfile({ response, user }: HttpContext) {
        return response.ok({ user: user.apiSerialize() });
    }

    public async sendResetPasswordEmail({ request, response, i18n }: HttpContext) {
        const { email } = await request.validateUsing(sendResetPasswordEmailValidator);

        const user: User = await this.userRepository.firstOrFail({ email });

        const previousResetPassword: ResetPassword | null = await this.resetPasswordRepository.findOneBy({ userId: user.id });
        if (previousResetPassword) {
            if (previousResetPassword.createdAt && previousResetPassword.createdAt > DateTime.now().minus({ minutes: 5 })) {
                return response.ok({
                    message: i18n.t('messages.profile.send-reset-password-email.success'),
                });
            } else {
                await previousResetPassword.delete();
            }
        }
        let token: string = '';
        let resetPassword: ResetPassword | null = null;
        do {
            token = crypto.randomBytes(32).toString('hex');
            resetPassword = await this.resetPasswordRepository.findOneBy({
                token,
            });
        } while (resetPassword);
        await ResetPassword.create({
            userId: user.id,
            token,
        });
        try {
            await this.mailService.sendResetPasswordEmail(user, `${env.get('FRONT_URI')}/reset-password/confirm/${token}`);
        } catch (error: any) {
            response.notFound({ error: i18n.t('profile.send-reset-password-email.error.mail-not-sent') });
        }

        return response.ok({
            message: i18n.t('messages.profile.send-reset-password-email.success'),
        });
    }

    public async resetPassword({ request, response, i18n }: HttpContext) {
        const { token } = await resetPasswordParamsValidator.validate(request.params());

        const resetPassword: ResetPassword = await this.resetPasswordRepository.firstOrFail(
            {
                token,
            },
            ['user']
        );

        const { password } = await request.validateUsing(resetPasswordValidator);

        resetPassword.user.password = password;
        await resetPassword.user.save();

        await resetPassword.delete();

        return response.ok({
            message: i18n.t('messages.profile.reset.success'),
        });
    }

    public async updateProfile({ request, response, user, i18n }: HttpContext) {
        const { username, profilePicture } = await request.validateUsing(updateProfileValidator);

        user.username = username;

        if (profilePicture) {
            if (user.profilePictureId) {
                // Physically delete the file
                this.fileService.delete(user.profilePicture);

                // Database file clear
                user.profilePictureId = null;
                await user.save();
                await user.profilePicture.delete();
            }

            profilePicture.clientName = `${cuid()}-${this.slugifyService.slugify(profilePicture.clientName)}`;
            const profilePicturePath = `static/profile-picture`;
            await profilePicture.move(app.makePath(profilePicturePath));
            const newProfilePicture: File = await File.create({
                name: profilePicture.clientName,
                path: `${profilePicturePath}/${profilePicture.clientName}`,
                extension: path.extname(profilePicture.clientName),
                mimeType: `${profilePicture.type}/${profilePicture.subtype}`,
                size: profilePicture.size,
                type: FileTypeEnum.PROFILE_PICTURE,
            });
            await newProfilePicture.refresh();
            user.profilePictureId = newProfilePicture.id;

            await cache.delete({ key: `user-profile-picture:${user.frontId}` });
            await cache.set({
                key: `user-profile-picture:${user.frontId}`,
                ttl: '1h',
                value: app.makePath(newProfilePicture.path),
            });
        }

        await user.save();
        await user.load('profilePicture');

        return response.ok({
            message: i18n.t('messages.profile.update-profile.success'),
            user: user.apiSerialize(),
        });
    }
}
