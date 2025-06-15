import type { Load } from '@sveltejs/kit';

export const load = (({ data }) => {
    return {
        ...data,
        isAdmin: true,
    };
}) satisfies Load;
