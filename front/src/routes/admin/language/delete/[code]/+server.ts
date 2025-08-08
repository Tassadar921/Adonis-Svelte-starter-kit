import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { m } from '#lib/paraglide/messages';

export const GET: RequestHandler = async ({ params, locals }): Promise<Response> => {
    try {
        const response = await locals.client.delete(`/api/admin/language/${params.code}`);

        if (response.status !== 200) {
            throw response;
        }

        return json({
            isSuccess: true,
            languages: response.data,
        });
    } catch (error: any) {
        return json(
            {
                isSuccess: false,
                message: error?.response?.data?.error || m['common.error.default-message'](),
            },
            { status: error?.response?.status || 500 }
        );
    }
};
