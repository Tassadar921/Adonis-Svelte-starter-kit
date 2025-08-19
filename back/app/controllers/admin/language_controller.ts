import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import LanguageRepository from '#repositories/language_repository';
import { searchAdminLanguagesValidator, deleteLanguageValidator, createLanguageValidator, getLanguageValidator, updateLanguageValidator } from '#validators/admin/language';
import Language from '#models/language';
import cache from '@adonisjs/cache/services/main';
import app from '@adonisjs/core/services/app';
import File from '#models/file';
import path from 'node:path';
import FileTypeEnum from '#types/enum/file_type_enum';
import FileService from '#services/file_service';
import { MultipartFile } from '@adonisjs/bodyparser/types';

@inject()
export default class AdminLanguageController {
    constructor(
        private readonly languageRepository: LanguageRepository,
        private readonly fileService: FileService
    ) {}

    public async getAll({ request, response }: HttpContext) {
        const { query, page, limit, sortBy: inputSortBy } = await request.validateUsing(searchAdminLanguagesValidator);

        const [field, order] = inputSortBy.split(':');
        const sortBy = { field: field as keyof Language['$attributes'], order: order as 'asc' | 'desc' };

        return response.ok(await this.languageRepository.getAdminLanguages(query, page, limit, sortBy));
    }

    public async delete({ request, response, i18n }: HttpContext) {
        const { languages } = await request.validateUsing(deleteLanguageValidator);

        const statuses: { isDeleted: boolean; isFallback?: boolean; name?: string; code: string }[] = await this.languageRepository.delete(languages);

        return response.ok({
            messages: await Promise.all(
                statuses.map(async (status: { isDeleted: boolean; isFallback?: boolean; name?: string; code: string }): Promise<{ code: string; message: string; isSuccess: boolean }> => {
                    if (status.isDeleted) {
                        await cache.deleteByTag({ tags: [`language:${status.code}`] });
                        return { code: status.code, message: i18n.t(`messages.admin.language.delete.success`, { name: status.name }), isSuccess: true };
                    } else {
                        if (status.isFallback) {
                            return { code: status.code, message: i18n.t(`messages.admin.language.delete.error.fallback`, { code: status.code }), isSuccess: false };
                        } else {
                            return { code: status.code, message: i18n.t(`messages.admin.language.delete.error.default`, { code: status.code }), isSuccess: false };
                        }
                    }
                })
            ),
        });
    }

    public async create({ request, response, i18n }: HttpContext) {
        const { name, code, flag: inputFlag } = await request.validateUsing(createLanguageValidator);

        let language: Language | null = await this.languageRepository.findOneBy({ code });
        if (language) {
            return response.badRequest({ error: i18n.t('messages.admin.language.create.error.already-exists', { code }) });
        }

        const flag: File = await this.processInputFlag(inputFlag, code);

        language = await Language.create({
            name,
            code,
            flagId: flag.id,
        });

        await language.load('flag');

        return response.created({ language: language.apiSerialize(), message: i18n.t('messages.admin.language.create.success', { name }) });
    }

    public async get({ request, response }: HttpContext) {
        const { languageCode: code } = await getLanguageValidator.validate(request.params());
        const language: Language = await this.languageRepository.firstOrFail({ code });

        return response.ok({ language: language.apiSerialize() });
    }

    public async update({ request, response, i18n }: HttpContext) {
        const { name, code, flag: inputFlag } = await request.validateUsing(updateLanguageValidator);

        const language: Language = await this.languageRepository.firstOrFail({ code });

        language.name = name;

        this.fileService.delete(language.flag);

        const flag: File = await this.processInputFlag(inputFlag, code);
    }

    private async processInputFlag(inputFlag: MultipartFile, code: string): Promise<File> {
        const extension: string = path.extname(inputFlag.clientName);
        inputFlag.clientName = `${code}${extension}`;
        const flagPath: string = `static/language-flag`;
        await inputFlag.move(app.makePath(flagPath));
        const flag: File = await File.create({
            name: inputFlag.clientName,
            path: `${flagPath}/${inputFlag.clientName}`,
            extension,
            mimeType: `${inputFlag.type}/${inputFlag.subtype}`,
            size: inputFlag.size,
            type: FileTypeEnum.PROFILE_PICTURE,
        });

        return await flag.refresh();
    }

    private async areSameFiles(file1: File, file2: File): Promise<boolean> {
        return file1.path === file2.path && file1.name === file2.name;
    }
}
