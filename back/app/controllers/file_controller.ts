import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import app from '@adonisjs/core/services/app';
import UserRepository from '#repositories/user_repository';
import User from '#models/user';
import { serveStaticProfilePictureFileValidator, serveStaticLanguageIconFileValidator } from '#validators/file';
import cache from '@adonisjs/cache/services/main';
import LanguageRepository from '#repositories/language_repository';
import Language from '#models/language';

@inject()
export default class FileController {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly languageRepository: LanguageRepository
    ) {}

    public async serveStaticProfilePictureFile({ request, response, i18n }: HttpContext) {
        const { userId } = await serveStaticProfilePictureFileValidator.validate(request.params());

        try {
            const filePath: string = await cache.getOrSet({
                key: `user-profile-picture:${userId}`,
                ttl: '1h',
                factory: async (): Promise<string> => {
                    const otherUser: User = await this.userRepository.firstOrFail({ frontId: userId });

                    if (!otherUser.profilePicture) {
                        throw new Error('NO_PICTURE');
                    }

                    return app.makePath(otherUser.profilePicture.path);
                },
            });

            return response.download(filePath);
        } catch (error: any) {
            if (error.message === 'NO_PICTURE') {
                return response.notFound({ error: i18n.t('messages.file.serve-status-profile-picture-file.error') });
            }
        }
    }

    public async serveStaticLanguageFlagFile({ request, response }: HttpContext) {
        const { languageCode } = await serveStaticLanguageIconFileValidator.validate(request.params());

        const filePath: string = await cache.getOrSet({
            key: `language-icon:${languageCode}`,
            tags: [`language:${languageCode}`],
            ttl: '1h',
            factory: async (): Promise<string> => {
                const language: Language = await this.languageRepository.firstOrFail({ code: languageCode }, ['flag']);

                return app.makePath(language.flag.path);
            },
        });

        return response.download(filePath);
    }
}
