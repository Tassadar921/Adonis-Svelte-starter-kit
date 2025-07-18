import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { client } from '#lib/api.server';
import { m } from '#lib/paraglide/messages';

export const POST: RequestHandler = async ({ request }): Promise<Response> => {
    try {
        const body: any = await request.json();

        const { data } = await client.post('/friends/add', body);

        return json({
            isSuccess: true,
            message: data.message
        });
    } catch (err: any) {
        return json(
            {
                isSuccess: false,
                message: err?.response?.data?.error || err.message || m['common.error.default-message']()
            },
            { status: err?.response?.status || 500 }
        );
    }
};
