import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import LanguageRepository from '#repositories/language_repository';
import { searchAdminLanguagesValidator } from '#validators/admin/language';

@inject()
export default class FileController {
    constructor(private readonly languageRepository: LanguageRepository) {}

    public async getAll({ request, response }: HttpContext) {
        const { query, page, limit, sortBy } = await request.validateUsing(searchAdminLanguagesValidator);

        return response.ok(await this.languageRepository.getAdminLanguages(query, page, limit, sortBy ?? { field: 'name', order: 'asc' }));
    }
}
