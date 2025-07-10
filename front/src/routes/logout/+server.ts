import type { RequestHandler } from '@sveltejs/kit';
import { client } from '#lib/api.server';
import { m } from '#lib/paraglide/messages';

export const POST: RequestHandler = async (event): Promise<Response> => {
    const { cookies } = event;

    cookies.delete('user', { path: '/' });
    cookies.delete('token', { path: '/' });

    try {
        const { data } = await client.delete('/api/logout');

        client.defaults.headers.common['Authorization'] = undefined;

        return new Response(
            JSON.stringify({
                isSuccess: true,
                message: data.message,
            })
        );
    } catch (error: any) {
        return new Response(
            JSON.stringify({
                isSuccess: false,
                message: error?.response?.data?.error ?? m['common.error.default-message'](),
            }),
            {
                status: error?.response?.status ?? 400,
            }
        );
    }
};
