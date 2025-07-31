import BaseRepository from '#repositories/base/base_repository';
import Language from '#models/language';
import SerializedLanguage from '#types/serialized/serialized_language';
import PaginatedLanguages from '#types/paginated/paginated_languages';
import { ModelPaginatorContract, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';

export default class LanguageRepository extends BaseRepository<typeof Language> {
    constructor() {
        super(Language);
    }

    public async getAdminLanguages(query: string, page: number, limit: number): Promise<PaginatedLanguages> {
        const languages: ModelPaginatorContract<Language> = await this.Model.query()
            .if(query, (queryBuilder: ModelQueryBuilderContract<typeof Language>): void => {
                queryBuilder.where('name', 'ILIKE', `%${query}%`).orWhere('code', 'ILIKE', `%${query}%`);
            })
            .paginate(page, limit);

        return {
            languages: languages.all().map((language: Language): SerializedLanguage => language.apiSerialize()),
            firstPage: languages.firstPage,
            lastPage: languages.lastPage,
            limit,
            total: languages.total,
            currentPage: page,
        };
    }
}
