import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import SerializedLanguage from '#types/serialized/serialized_language';
import File from '#models/file';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';

interface LanguageInterface {
    name: string;
    code: string;
    isFallback?: boolean;
}

export default class Language extends BaseModel {
    public static LANGUAGE_ENGLISH: LanguageInterface = {
        name: 'English',
        code: 'en',
        isFallback: true,
    };

    public static LANGUAGE_FRENCH: LanguageInterface = {
        name: 'Français',
        code: 'fr',
    };

    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare name: string;

    @column()
    declare code: string;

    @column()
    declare isFallback: boolean;

    @column()
    declare iconId: string | null;

    @belongsTo((): typeof File => File, {
        foreignKey: 'iconId',
    })
    declare icon: BelongsTo<typeof File>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    public apiSerialize(): SerializedLanguage {
        return {
            name: this.name,
            code: this.code,
            isFallback: this.isFallback,
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
