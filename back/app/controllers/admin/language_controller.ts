import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import LanguageRepository from '#repositories/language_repository';
import { searchAdminLanguagesValidator, deleteAdminLanguageValidator } from '#validators/admin/language';
import Language from '#models/language';

@inject()
export default class FileController {
    constructor(private readonly languageRepository: LanguageRepository) {}

    public async getAll({ request, response }: HttpContext) {
        const { query, page, limit, sortBy: inputSortBy } = await request.validateUsing(searchAdminLanguagesValidator);

        const [field, order] = inputSortBy.split(':');
        const sortBy = { field: field as keyof Language['$attributes'], order: order as 'asc' | 'desc' };

        return response.ok(await this.languageRepository.getAdminLanguages(query, page, limit, sortBy));
    }

    public async delete({ request, response }: HttpContext) {
        const { code } = await deleteAdminLanguageValidator.validate(request.params());

        const deleted: boolean = await this.languageRepository.delete(code);
        if (!deleted) {
            return response.notFound({ error: 'Language not found' });
        }

        return response.ok({ deleted });
    }
}
