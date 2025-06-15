import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';
import SerializedFile from '#types/serialized/serialized_file';
import FileTypeEnum from '#types/enum/file_type_enum';

export default class File extends BaseModel {
    @column({ isPrimary: true })
    declare public id: string;

    @column()
    declare public name: string;

    @column()
    declare public path: string;

    @column()
    declare public extension: string;

    @column()
    declare public mimeType: string;

    // File size in bytes
    @column()
    declare public size: number;

    @column()
    declare public type: FileTypeEnum;

    @column.dateTime({ autoCreate: true })
    declare public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare public updatedAt: DateTime;

    public apiSerialize(): SerializedFile {
        return {
            name: this.name,
            path: this.path,
            extension: this.extension,
            mimeType: this.mimeType,
            size: this.size,
            type: this.type,
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
