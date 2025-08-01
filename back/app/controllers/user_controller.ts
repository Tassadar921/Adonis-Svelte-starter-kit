import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import UserRepository from '#repositories/user_repository';
import { getUsersValidator } from '#validators/user';
import cache from '@adonisjs/cache/services/main';
import PaginatedUsers from '#types/paginated/paginated_users';

@inject()
export default class UserController {
    constructor(private readonly userRepository: UserRepository) {}

    public async searchNotFriends({ request, response, user }: HttpContext) {
        const { query, page, limit } = await getUsersValidator.validate(request.params());

        await cache.delete({ key: `user-not-friends:${user.id}` });
        console.log(`user-not-friends:${user.id}`);
        console.log(user.username);

        return response.ok({
            users: await cache.getOrSet({
                key: `user-not-friends:${user.id}`,
                ttl: '1m',
                factory: async (): Promise<PaginatedUsers> => {
                    return await this.userRepository.searchNotFriends(query ?? '', page ?? 1, limit ?? 10, user);
                },
            }),
        });
    }
}
