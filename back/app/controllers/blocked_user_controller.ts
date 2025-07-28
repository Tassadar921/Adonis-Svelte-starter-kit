import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import BlockedUserRepository from '#repositories/blocked_user_repository';
import { blockValidator, cancelValidator, getBlockedUsersValidator } from '#validators/blocked';
import User from '#models/user';
import PendingFriend from '#models/pending_friend';
import UserRepository from '#repositories/user_repository';
import PendingFriendRepository from '#repositories/pending_friend_repository';
import Friend from '#models/friend';
import FriendRepository from '#repositories/friend_repository';
import BlockedUser from '#models/blocked_user';
import transmit from '@adonisjs/transmit/services/main';
import cache from '@adonisjs/cache/services/main';
import PaginatedBlockedUsers from '#types/paginated/paginated_blocked_users';

@inject()
export default class BlockedUserController {
    constructor(
        private readonly blockedUserRepository: BlockedUserRepository,
        private readonly userRepository: UserRepository,
        private readonly pendingFriendRepository: PendingFriendRepository,
        private readonly friendRepository: FriendRepository
    ) {}

    public async search({ request, response, user }: HttpContext) {
        const { query, page, limit } = await request.validateUsing(getBlockedUsersValidator);

        return response.ok({
            blockedUsers: await cache.getOrSet({
                key: `user-blocked:${user.id}`,
                ttl: '5m',
                factory: async (): Promise<PaginatedBlockedUsers> => {
                    return await this.blockedUserRepository.search(query ?? '', page ?? 1, limit ?? 10, user);
                },
            }),
        });
    }

    public async block({ request, response, user, i18n }: HttpContext) {
        const { userId } = await blockValidator.validate(request.params());

        const targetUser: User = await this.userRepository.firstOrFail({ frontId: userId });

        const blockedUsers: BlockedUser[] = await this.blockedUserRepository.findFromUsers(user, targetUser);
        if (blockedUsers.length) {
            return response.conflict({ error: i18n.t('messages.blocked-user.block.error', { username: targetUser.username }) });
        }

        const pendingFriends: PendingFriend[] = await this.pendingFriendRepository.findFromUsers(user, targetUser);

        const friendRelationships: Friend[] = await this.friendRepository.findFromUsers(user, targetUser);
        if (friendRelationships.length) {
            await Promise.all([...friendRelationships.map(async (friend: Friend): Promise<void> => friend.delete())]);
        } else {
            await Promise.all([cache.delete({ key: `user-not-friends:${user.id}` }), cache.delete({ key: `user-not-friends:${targetUser.id}` })]);
        }

        await Promise.all([
            ...pendingFriends.map(async (pendingFriend: PendingFriend): Promise<void> => {
                transmit.broadcast(`notification/add-friend/cancel/${userId}`, pendingFriend.apiSerialize());
                await pendingFriend.delete();
            }),
            BlockedUser.create({
                blockerId: user.id,
                blockedId: targetUser.id,
            }),
            cache.delete({ key: `user-blocked:${user.id}` }),
            cache.delete({ key: `user-blocked:${targetUser.id}` }),
        ]);

        transmit.broadcast(`notification/blocked/${userId}`, user.apiSerialize());

        return response.ok({ message: i18n.t('messages.blocked-user.block.success', { username: targetUser.username }) });
    }

    public async cancel({ request, response, user, i18n }: HttpContext) {
        const { userId } = await cancelValidator.validate(request.params());

        const targetUser: User | null = await this.userRepository.firstOrFail({ frontId: userId });

        const blockedUsers: BlockedUser[] = await this.blockedUserRepository.findFromUsers(user, targetUser);
        if (!blockedUsers.length) {
            return response.notFound({ error: i18n.t('messages.blocked-user.cancel.error', { username: targetUser.username }) });
        }

        await Promise.all([
            ...blockedUsers.map((blockedUser: BlockedUser): Promise<void> => blockedUser.delete()),
            cache.delete({ key: `user-blocked:${user.id}` }),
            cache.delete({ key: `user-blocked:${targetUser.id}` }),
        ]);

        transmit.broadcast(`notification/unblocked/${userId}`);

        return response.ok({ message: i18n.t('messages.blocked-user.cancel.success', { username: targetUser.username }) });
    }
}
