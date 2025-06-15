import { DateTime } from 'luxon';
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm';
import type { HasMany } from '@adonisjs/lucid/types/relations';
import SettingChoice from '#models/setting_choice';
import SerializedSettingChoice from '#types/serialized/serialized_setting_choice';
import SerializedSetting from '#types/serialized/serialized_setting';

export default class Setting extends BaseModel {
    @column({ isPrimary: true })
    declare public id: string;

    @column()
    declare public key: string;

    @hasMany((): typeof SettingChoice => SettingChoice)
    declare public choices: HasMany<typeof SettingChoice>;

    @column.dateTime({ autoCreate: true })
    declare public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare public updatedAt: DateTime;

    public apiSerialize(): SerializedSetting {
        return {
            key: this.key,
            choices: this.choices?.map((choice: SettingChoice): SerializedSettingChoice => choice.apiSerialize()),
        };
    }
}
