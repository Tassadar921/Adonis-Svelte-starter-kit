import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import app from '@adonisjs/core/services/app';
import UserRepository from '#repositories/user_repository';
import User from '#models/user';
import {
    serveStaticProfilePictureFileValidator,
} from '#validators/file';
import cache from '@adonisjs/cache/services/main';

@inject()
export default class FileController {
    constructor(
        private readonly userRepository: UserRepository,
    ) {}

    public async serveStaticProfilePictureFile({ request, response }: HttpContext): Promise<void> {
        const { userId } = await serveStaticProfilePictureFileValidator.validate(request.params());

        try {
            const filePath: string = await cache.getOrSet({
                key: `user-profile-picture:${userId}`,
                ttl: '1h',
                factory: async (): Promise<string> => {
                    const otherUser: User = await this.userRepository.firstOrFail({ frontId: userId }, ['profilePicture']);

                    if (!otherUser.profilePicture) {
                        throw new Error('NO_PICTURE');
                    }

                    return app.makePath(otherUser.profilePicture.path);
                },
            });

            return response.download(filePath);
        } catch (error: any) {
            if (error.message === 'NO_PICTURE') {
                return response.notFound({ error: "User's profile picture not found" });
            }
        }
    }
}
