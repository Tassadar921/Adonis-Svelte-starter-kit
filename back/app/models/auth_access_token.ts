import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import User from '#models/user';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

export default class AuthAccessToken extends BaseModel {
    @column({ isPrimary: true })
    declare public id: string;

    @column()
    declare public tokenableId: string;

    @belongsTo((): typeof User => User, {
        foreignKey: 'tokenableId',
    })
    declare public user: BelongsTo<typeof User>;

    @column()
    declare public type: string;

    @column()
    declare public name?: string | null;

    @column()
    declare public hash: string;

    @column()
    declare public abilities: string;

    @column.dateTime()
    declare public lastUsedAt: DateTime;

    @column.dateTime()
    declare public expiresAt: DateTime;

    @column.dateTime()
    declare createdAt: DateTime;

    @column.dateTime()
    declare updatedAt: DateTime;
}
