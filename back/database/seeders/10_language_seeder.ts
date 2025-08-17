import { BaseSeeder } from '@adonisjs/lucid/seeders';
import Language from '#models/language';
import LanguageRepository from '#repositories/language_repository';
import path from 'path';
import fsPromises from 'fs/promises';
import app from '@adonisjs/core/services/app';
import FileService from '#services/file_service';
import File from '#models/file';
import FileTypeEnum from '#types/enum/file_type_enum';

export default class extends BaseSeeder {
    public async run(): Promise<void> {
        const languageRepository: LanguageRepository = new LanguageRepository();
        const fileService: FileService = new FileService();

        for (const language of [Language.LANGUAGE_ENGLISH, Language.LANGUAGE_FRENCH]) {
            const path: string = await this.moveLanguageIcon(language.code);
            const { size, mimeType, extension, name } = await fileService.getFileInfo(app.makePath(`${path}/${language.code}.svg`));
            const icon: File = await File.create({
                name,
                path: `${path}/${language.code}.svg`,
                extension,
                mimeType,
                size,
                type: FileTypeEnum.LANGUAGE_ICON,
            });
            await icon.refresh();

            if (!(await languageRepository.findOneBy({ code: language.code }))) {
                await Language.create({
                    name: language.name,
                    code: language.code,
                    isFallback: language.isFallback || false,
                    iconId: icon.id,
                });
            }
        }
    }

    private async moveLanguageIcon(code: string): Promise<string> {
        const targetDir: string = path.join(process.cwd(), 'static/language');
        const targetFile: string = path.join(targetDir, `${code}.svg`);

        try {
            await fsPromises.mkdir(targetDir, { recursive: true });

            try {
                await fsPromises.access(targetFile);
            } catch {
                await fsPromises.copyFile(path.join(process.cwd(), `database/seeders/language/${code}.svg`), targetFile);
                console.log(`Copied ${code}.svg`);
            }
        } catch (error: any) {
            console.error(`An error occurred while copying ${code}.svg :`, error);
        }

        return targetDir;
    }
}
