import { loadFlash, redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';
import { client } from '#lib/api.server';
import { m } from '#lib/paraglide/messages';

export const load: PageServerLoad = loadFlash(async (event) => {
    const { url, cookies } = event;
    const provider: string | null = url.searchParams.get('provider');
    const token: string | null = url.searchParams.get('token');

    let data: any;
    let isSuccess: boolean = true;

    try {
        const { data: returnedData } = await client.post(`api/auth/confirm/${provider}/${token}`);
        data = returnedData;
    } catch (error: any) {
        isSuccess = false;
        data = error?.response?.data;
    }

    if (isSuccess) {
        cookies.set('user', JSON.stringify(data.user), {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
        });

        cookies.set('token', data.token.token, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
        });

        client.defaults.headers.common['Authorization'] = `Bearer ${data.token.token}`;

        const previousPathName: string | undefined = cookies.get('previousPathName');
        cookies.delete('previousPathName', { path: '/' });
        redirect(
            303,
            `/${cookies.get('PARAGLIDE_LOCALE')}${previousPathName ? `/${previousPathName}` : ''}`,
            {
                type: 'success',
                message: data?.message,
            },
            event
        );
    } else {
        redirect(
            {
                type: 'error',
                message: data?.error ?? m['common.error.default-message'](),
            },
            event
        );
    }
});
