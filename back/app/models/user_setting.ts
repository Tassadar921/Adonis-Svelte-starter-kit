import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import User from './user.js';
import Setting from '#models/setting';
import SerializedUserSetting from '#types/serialized/serialized_user_setting';

export default class UserSetting extends BaseModel {
    @column({ isPrimary: true })
    declare public id: string;

    @column({
        prepare: (value: string | number | boolean): string => JSON.stringify(value),
        consume: (value: string): string | number | boolean => {
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        },
    })
    declare public value: string | number | boolean;

    @column()
    declare public userId: string;

    @belongsTo((): typeof User => User)
    declare public user: BelongsTo<typeof User>;

    @column()
    declare public settingId: string;

    @belongsTo((): typeof Setting => Setting)
    declare public setting: BelongsTo<typeof Setting>;

    @column.dateTime({ autoCreate: true })
    declare public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare public updatedAt: DateTime;

    public apiSerialize(): SerializedUserSetting {
        return {
            value: this.value,
            setting: this.setting.apiSerialize(),
        };
    }
}
