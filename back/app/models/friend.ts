import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import User from '#models/user';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import SerializedFriend from '#types/serialized/serialized_friend';

export default class Friend extends BaseModel {
    @column({ isPrimary: true })
    declare public id: string;

    @column()
    declare public frontId: number;

    @column()
    declare public userId: string;

    @belongsTo((): typeof User => User)
    declare public user: BelongsTo<typeof User>;

    @column()
    declare public friendId: string;

    @belongsTo((): typeof User => User, {
        foreignKey: 'friendId',
    })
    declare public friend: BelongsTo<typeof User>;

    @column.dateTime({ autoCreate: true })
    declare public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare public updatedAt: DateTime;

    public apiSerialize(): SerializedFriend {
        return {
            id: this.frontId,
            friend: this.friend.apiSerialize(),
            updatedAt: this.updatedAt?.toString(),
            createdAt: this.createdAt?.toString(),
        };
    }
}
