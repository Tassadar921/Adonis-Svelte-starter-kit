import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { m } from '#lib/paraglide/messages';

export const POST: RequestHandler = async ({ request, params, locals }): Promise<Response> => {
    const body = await request.json();
    try {
        const response = await locals.client.post(`/api/admin/language/delete`, {
            languages: body.languages,
        });

        if (response.status !== 200) {
            throw response;
        }

        console.log(response.data);

        return json({
            isSuccess: true,
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
