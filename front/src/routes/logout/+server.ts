import type { RequestHandler } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { tuyau } from '#lib/api.server';
import { m } from '#lib/paraglide/messages';

export const POST: RequestHandler = async (event): Promise<Response> => {
    const { cookies, params } = event;

    let data;

    try {
        console.log(cookies.get('apiToken'));
        console.log(cookies.get('api_token'));
        const data = await tuyau.api.logout.$delete();
        // cookies.delete('user', { path: '/' });
        // data = returnedData;
    } catch (error: any) {
        return new Response(
            JSON.stringify({
                isSuccess: false,
                message: error?.response?.data?.error ?? m['common.error.default-message'](),
                language: params.language,
            }),
            {
                status: error?.response?.status ?? 400,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    redirect(
        303,
        `/${params.language}/login`,
        {
            type: 'success',
            message: data.message,
        },
        event
    );
};
