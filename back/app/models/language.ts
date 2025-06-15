import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';
import SerializedLanguage from '#types/serialized/serialized_language';

export default class Language extends BaseModel {
    public static LANGUAGE_FRENCH: { name: string; code: string } = {
        name: 'Français',
        code: 'fr',
    };
    public static LANGUAGE_ENGLISH: { name: string; code: string } = {
        name: 'English',
        code: 'en',
    };

    @column({ isPrimary: true })
    declare public id: string;

    @column()
    declare public name: string;

    @column()
    declare public code: string;

    @column.dateTime({ autoCreate: true })
    declare public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare public updatedAt: DateTime;

    public apiSerialize(): SerializedLanguage {
        return {
            name: this.name,
            code: this.code,
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
