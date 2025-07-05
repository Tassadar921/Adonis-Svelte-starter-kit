import type { RequestHandler } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import axios from '$lib/api';
import { m } from '$lib/paraglide/messages';

export const POST: RequestHandler = async (event): Promise<Response> => {
    const { cookies, params } = event;

    let data;

    try {
        const response = await axios.delete('/api/logout');
        cookies.delete('user', { path: '/' });
        data = response.data;
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
