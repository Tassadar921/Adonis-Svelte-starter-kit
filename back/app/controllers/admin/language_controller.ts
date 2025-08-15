import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import LanguageRepository from '#repositories/language_repository';
import { searchAdminLanguagesValidator, deleteAdminLanguageValidator } from '#validators/admin/language';
import Language from '#models/language';

@inject()
export default class AdminLanguageController {
    constructor(private readonly languageRepository: LanguageRepository) {}

    public async getAll({ request, response }: HttpContext) {
        const { query, page, limit, sortBy: inputSortBy } = await request.validateUsing(searchAdminLanguagesValidator);

        const [field, order] = inputSortBy.split(':');
        const sortBy = { field: field as keyof Language['$attributes'], order: order as 'asc' | 'desc' };

        return response.ok(await this.languageRepository.getAdminLanguages(query, page, limit, sortBy));
    }

    public async delete({ request, response, i18n }: HttpContext) {
        const { languages } = await request.validateUsing(deleteAdminLanguageValidator);

        const statuses: { isDeleted: boolean; isFallback?: boolean; name?: string; code: string }[] = await this.languageRepository.delete(languages);

        return response.ok({
            messages: statuses.map((status: { isDeleted: boolean; isFallback?: boolean; name?: string; code: string }): { code: string; message: string; isSuccess: boolean } => {
                if (status.isDeleted) {
                    return { code: status.code, message: i18n.t(`messages.admin.language.delete.success`, { name: status.name }), isSuccess: true };
                } else {
                    if (status.isFallback) {
                        return { code: status.code, message: i18n.t(`messages.admin.language.delete.error.fallback`, { code: status.code }), isSuccess: false };
                    } else {
                        return { code: status.code, message: i18n.t(`messages.admin.language.delete.error.default`, { code: status.code }), isSuccess: false };
                    }
                }
            }),
        });
    }
}
