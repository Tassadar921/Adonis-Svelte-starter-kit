import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import SerializedSettingChoice from '#types/serialized/serialized_setting_choice';
import Setting from '#models/setting';

export default class SettingChoice extends BaseModel {
    @column({ isPrimary: true })
    declare public id: string;

    @column()
    declare public frontId: number;

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
    declare public isDefault: boolean;

    @column()
    declare public settingId: string;

    @belongsTo((): typeof Setting => Setting)
    declare public setting: BelongsTo<typeof Setting>;

    @column.dateTime({ autoCreate: true })
    declare public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare public updatedAt: DateTime;

    public apiSerialize(): SerializedSettingChoice {
        return {
            id: this.frontId,
            value: this.value,
        };
    }
}
