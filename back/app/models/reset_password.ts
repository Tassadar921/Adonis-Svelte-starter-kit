import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import User from '#models/user';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';

export default class ResetPassword extends BaseModel {
    @column({ isPrimary: true })
    declare public id: string;

    @column()
    declare public userId: string;

    @belongsTo((): typeof User => User)
    declare public user: BelongsTo<typeof User>;

    @column()
    declare public token: string;

    @column.dateTime({ autoCreate: true })
    declare public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare public updatedAt: DateTime;
}
