import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { client } from '#lib/api.server';
import { m } from '#lib/paraglide/messages';

export const GET: RequestHandler = async ({ params }): Promise<Response> => {
    try {
        const { data } = await client.get(`/blocked/add/${params.id}`);

        return json({
            isSuccess: true,
            message: data.message,
        });
    } catch (err: any) {
        return json(
            {
                isSuccess: false,
                message: err?.response?.data?.error || err.message || m['common.error.default-message'](),
            },
            { status: err?.response?.status || 500 }
        );
    }
};
