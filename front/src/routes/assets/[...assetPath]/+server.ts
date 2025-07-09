import type { RequestHandler } from '@sveltejs/kit';
import { client } from '#lib/api.server';
import { m } from '#lib/paraglide/messages';
import type { AxiosResponse } from 'axios';

export const GET: RequestHandler = async (event): Promise<Response> => {
    const { params } = event;

    try {
        const response = await client.get(`/api/static/${params.assetPath}`, {
            responseType: 'arraybuffer',
        });

        return new Response(response.data, {
            headers: {
                'Content-Type': response.headers['content-type'] || 'application/octet-stream',
                'Content-Disposition': response.headers['content-disposition'] || 'inline',
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error: any) {
        console.log(error);
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
