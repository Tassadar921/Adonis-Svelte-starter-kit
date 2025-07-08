import type { Actions, RequestEvent } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { m } from '#lib/paraglide/messages';
import { client } from '#lib/api.server';

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        const { request, params, cookies } = event;

        const formData: FormData = await request.formData();
        const email: string | null = <string | null>formData.get('email');
        const password: string | null = <string | null>formData.get('password');

        if (!email || !password) {
            return fail(400, { error: 'Email and password are required' });
        }

        let data: any;
        let isSuccess: boolean = true;

        try {
            const { data: returnedData } = await client.post('api/auth', {
                email,
                password,
            });
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
    },
};
