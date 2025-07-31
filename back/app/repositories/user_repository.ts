import BaseRepository from '#repositories/base/base_repository';
import User from '#models/user';
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model';
import PaginatedUsers from '#types/paginated/paginated_users';
import SerializedUser from '#types/serialized/serialized_user';

export default class UserRepository extends BaseRepository<typeof User> {
    constructor() {
        super(User);
    }

    public async searchNotFriends(query: string, page: number, limit: number, user: User): Promise<PaginatedUsers> {
        const users: ModelPaginatorContract<User> = await this.Model.query()
            .select('users.*')
            .select('received_pending_friends.id as receivedPendingFriendId')
            .select('sent_pending_friends.id as sentPendingFriendId')
            .leftJoin('blocked_users as blocked', (blockedJoin): void => {
                blockedJoin
                    .on((builder): void => {
                        builder.on('users.id', '=', 'blocked.blocked_id').andOnVal('blocked.blocker_id', '=', user.id);
                    })
                    .orOn((builder): void => {
                        builder.on('users.id', '=', 'blocked.blocker_id').andOnVal('blocked.blocked_id', '=', user.id);
                    });
            })
            .leftJoin('friends', (friendJoin): void => {
                friendJoin.on('users.id', '=', 'friends.friend_id').andOnVal('friends.user_id', '=', user.id);
            })
            .leftJoin('pending_friends as received_pending_friends', (receivedJoin): void => {
                receivedJoin.on('users.id', '=', 'received_pending_friends.user_id').andOnVal('received_pending_friends.friend_id', '=', user.id);
            })
            .leftJoin('pending_friends as sent_pending_friends', (sentJoin): void => {
                sentJoin.on('users.id', '=', 'sent_pending_friends.friend_id').andOnVal('sent_pending_friends.user_id', '=', user.id);
            })
            .if(query, (queryBuilder): void => {
                queryBuilder.whereILike('users.username', `%${query}%`);
            })
            .whereNull('blocked.blocker_id')
            .whereNull('friends.user_id')
            .whereNot('users.id', user.id)
            .paginate(page, limit);

        return {
            users: await Promise.all(
                users.all().map((user: User): SerializedUser => {
                    return { ...user.apiSerialize(), receivedFriendRequest: !!user.$extras.receivedPendingFriendId, sentFriendRequest: !!user.$extras.sentPendingFriendId };
                })
            ),
            firstPage: users.firstPage,
            lastPage: users.lastPage,
            limit,
            total: users.total,
            currentPage: page,
        };
    }
}
