import { m } from '#lib/paraglide/messages';
import { redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const { locals, params, cookies } = event;

    try {
        const response = await locals.client.get(`/api/admin/language/${params.code}`);

        if (response.status !== 200) {
            throw response;
        }

        return {
            isSuccess: true,
            language: response.data.language,
        };
    } catch (error: any) {
        redirect(
            `/${cookies.get('PARAGLIDE_LOCALE')}/admin/language`,
            {
                type: 'error',
                message: error?.response?.data?.error ?? m['common.error.default-message'](),
            },
            event
        );
    }
};
