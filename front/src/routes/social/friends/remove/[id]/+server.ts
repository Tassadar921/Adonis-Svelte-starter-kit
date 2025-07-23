import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { client } from '#lib/api.server';
import { m } from '#lib/paraglide/messages';

export const DELETE: RequestHandler = async ({ params }): Promise<Response> => {
    try {
        const { data } = await client.delete(`/friends/remove/${params.id}`);

        return json({
            isSuccess: true,
            message: data.message,
        });
    } catch (error: any) {
        return json(
            {
                isSuccess: false,
                message: error?.response?.data?.error || error.message || m['common.error.default-message'](),
            },
            { status: error?.response?.status || 500 }
        );
    }
};
