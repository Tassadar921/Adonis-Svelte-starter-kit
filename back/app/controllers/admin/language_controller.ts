import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { searchFriendsValidator } from '#validators/friend';
import LanguageRepository from '#repositories/language_repository';

@inject()
export default class FileController {
    constructor(private readonly languageRepository: LanguageRepository) {}

    public async getAll({ request, response }: HttpContext) {
        const { query, page, limit } = await request.validateUsing(searchFriendsValidator);

        return response.ok(await this.languageRepository.getAdminLanguages(query ?? '', page ?? 1, limit ?? 30));
    }
}
