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
import UserRepository from '#repositories/user_repository';
import { deleteUsersValidator, searchAdminUsersValidator } from '#validators/admin/user';

@inject()
export default class AdminUserController {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly fileService: FileService
    ) {}

    public async getAll({ request, response }: HttpContext) {
        const { query, page, limit, sortBy: inputSortBy } = await request.validateUsing(searchAdminUsersValidator);

        const [field, order] = inputSortBy.split(':');
        const sortBy = { field: field as keyof Language['$attributes'], order: order as 'asc' | 'desc' };

        return response.ok(await this.userRepository.getAdminUsers(query, page, limit, sortBy));
    }

    public async delete({ request, response, i18n, user }: HttpContext) {
        const { users } = await request.validateUsing(deleteUsersValidator);

        const statuses: { isDeleted: boolean; isCurrentUser?: boolean; username?: string; frontId: number }[] = await this.userRepository.delete(users, user);

        return response.ok({
            messages: await Promise.all(
                statuses.map(async (status: { isDeleted: boolean; isCurrentUser?: boolean; username?: string; frontId: number }): Promise<{ id: number; message: string; isSuccess: boolean }> => {
                    if (status.isDeleted) {
                        await cache.deleteByTag({ tags: [`language:${status.code}`] });
                        return { id: status.frontId, message: i18n.t(`messages.admin.user.delete.success`, { username: status.username }), isSuccess: true };
                    } else {
                        if (status.isCurrentUser) {
                            return { id: status.frontId, message: i18n.t(`messages.admin.user.delete.error.current`, { username: status.username }), isSuccess: false };
                        } else {
                            return { id: status.frontId, message: i18n.t(`messages.admin.user.delete.error.default`, { frontId: status.frontId }), isSuccess: false };
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

    public async update({ request, response, i18n }: HttpContext) {
        const { name, code, flag: inputFlag } = await request.validateUsing(updateLanguageValidator);

        const language: Language = await this.languageRepository.firstOrFail({ code });

        language.name = name;

        if (!this.areSameFiles(language.flag, inputFlag)) {
            this.fileService.delete(language.flag);
            const flag: File = await this.processInputFlag(inputFlag, code);
            language.flagId = flag.id;
        }

        await language.save();

        return response.ok({ language: language.apiSerialize(), message: i18n.t('messages.admin.language.update.success', { name }) });
    }

    public async get({ request, response }: HttpContext) {
        const { languageCode: code } = await getLanguageValidator.validate(request.params());
        const language: Language = await this.languageRepository.firstOrFail({ code });

        return response.ok({ language: language.apiSerialize() });
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

    private areSameFiles(file: File, multipartFile: MultipartFile): boolean {
        return (
            file.extension === path.extname(multipartFile.clientName) &&
            file.mimeType === `${multipartFile.type}/${multipartFile.subtype}` &&
            file.size === multipartFile.size &&
            file.type === multipartFile.type
        );
    }
}
