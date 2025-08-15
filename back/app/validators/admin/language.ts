import vine from '@vinejs/vine';
import { sortByLanguageRule } from '#validators/admin/custom/language';

export const searchAdminLanguagesValidator = vine.compile(
    vine.object({
        query: vine.string().trim(),
        page: vine.number().positive(),
        limit: vine.number().positive(),
        sortBy: vine.string().trim().use(sortByLanguageRule()),
    })
);

export const deleteAdminLanguageValidator = vine.compile(
    vine.object({
        languages: vine.array(vine.string().fixedLength(2).toLowerCase()),
    })
);
