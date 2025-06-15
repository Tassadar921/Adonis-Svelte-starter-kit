import type { Load } from '@sveltejs/kit';

export const load = (async ({ data }) => {
    return {
        ...data,
    };
}) satisfies Load;
