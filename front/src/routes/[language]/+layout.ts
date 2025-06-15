import type { Load } from '@sveltejs/kit';

export const load = (({ params, data }) => {
    return {
        ...data,
        language: params.language,
    };
}) satisfies Load;
