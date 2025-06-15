import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import User from '#models/user';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import SerializedBlockedUser from '#types/serialized/serialized_blocked_user';

export default class BlockedUser extends BaseModel {
    @column({ isPrimary: true })
    declare public id: string;

    @column()
    declare public frontId: number;

    @column()
    declare public blockerId: string;

    @belongsTo((): typeof User => User, {
        foreignKey: 'blockerId',
    })
    declare public blocker: BelongsTo<typeof User>;

    @column()
    declare public blockedId: string;

    @belongsTo((): typeof User => User, {
        foreignKey: 'blockedId',
    })
    declare public blocked: BelongsTo<typeof User>;

    @column.dateTime({ autoCreate: true })
    declare public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare public updatedAt: DateTime;

    public apiSerialize(): SerializedBlockedUser {
        return {
            id: this.frontId,
            user: this.blocked.apiSerialize(),
            updatedAt: this.updatedAt?.toString(),
            createdAt: this.createdAt?.toString(),
        };
    }
}
