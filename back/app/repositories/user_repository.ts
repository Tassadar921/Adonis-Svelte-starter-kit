import BaseRepository from '#repositories/base/base_repository';
import User from '#models/user';
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model';
import PaginatedUsers from '#types/paginated/paginated_users';
import SerializedUser from '#types/serialized/serialized_user';
import UserRoleEnum from '#types/enum/user_role_enum';

export default class UserRepository extends BaseRepository<typeof User> {
    constructor() {
        super(User);
    }

    public async findOneByToken(tokenId: string): Promise<User> {
        return await this.Model.query().select('users.*').leftJoin('auth_access_tokens', 'auth_access_tokens.tokenable_id', 'users.id').where('auth_access_tokens.id', tokenId).firstOrFail();
    }

    public async searchNotFriends(query: string, page: number, limit: number, user: User): Promise<PaginatedUsers> {
        const users: ModelPaginatorContract<User> = await this.Model.query()
            .select('users.*')
            .select('received_pending_friends.id as receivedPendingFriendId')
            .select('sent_pending_friends.id as sentPendingFriendId')
            .leftJoin('blocked_users as blocked', (blockedJoin) => {
                blockedJoin
                    .on((builder) => {
                        builder.on('users.id', '=', 'blocked.blocked_id').andOnVal('blocked.blocker_id', '=', user.id);
                    })
                    .orOn((builder) => {
                        builder.on('users.id', '=', 'blocked.blocker_id').andOnVal('blocked.blocked_id', '=', user.id);
                    });
            })
            .leftJoin('friends', (friendJoin) => {
                friendJoin.on('users.id', '=', 'friends.friend_id').andOnVal('friends.user_id', '=', user.id);
            })
            .leftJoin('pending_friends as received_pending_friends', (receivedJoin) => {
                receivedJoin.on('users.id', '=', 'received_pending_friends.user_id').andOnVal('received_pending_friends.friend_id', '=', user.id);
            })
            .leftJoin('pending_friends as sent_pending_friends', (sentJoin) => {
                sentJoin.on('users.id', '=', 'sent_pending_friends.friend_id').andOnVal('sent_pending_friends.user_id', '=', user.id);
            })
            .if(query, (queryBuilder) => {
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

    public async getAdmin() {
        return this.Model.query().where('role', UserRoleEnum.ADMIN).firstOrFail;
    }
}
