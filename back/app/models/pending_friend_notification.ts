import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import User from '#models/user';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import PendingFriend from '#models/pending_friend';
import SerializedPendingFriendNotification from '#types/serialized/serialized_pending_friend_notification';
import NotificationTypeEnum from '#types/enum/notification_type_enum';

export default class PendingFriendNotification extends BaseModel {
    @column({ isPrimary: true })
    declare public id: string;

    @column()
    declare public frontId: number;

    @column()
    declare public forId: string;

    @belongsTo((): typeof User => User, {
        foreignKey: 'forId',
    })
    declare public for: BelongsTo<typeof User>;

    @column()
    declare public fromId: string;

    @belongsTo((): typeof User => User, {
        foreignKey: 'fromId',
    })
    declare public from: BelongsTo<typeof User>;

    @column()
    declare public pendingFriendId: string;

    @belongsTo((): typeof PendingFriend => PendingFriend)
    declare public pendingFriend: BelongsTo<typeof PendingFriend>;

    @column()
    declare public seen: boolean;

    @column.dateTime({ autoCreate: true })
    declare public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare public updatedAt: DateTime;

    public apiSerialize(): SerializedPendingFriendNotification {
        return {
            id: this.frontId,
            seen: this.seen,
            from: this.from.apiSerialize(),
            type: NotificationTypeEnum.PENDING_FRIEND,
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
