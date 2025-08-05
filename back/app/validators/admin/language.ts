import vine from '@vinejs/vine';

export const searchAdminLanguagesValidator = vine.compile(
    vine.object({
        query: vine.string().trim(),
        page: vine.number().positive(),
        limit: vine.number().positive(),
        sortBy: vine
            .object({
                field: vine.string().trim(),
                order: vine.enum(['asc', 'desc']),
            })
            .optional(),
    })
);
