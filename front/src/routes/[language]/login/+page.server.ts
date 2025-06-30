import type { Actions, RequestEvent } from '@sveltejs/kit';
import axios from '$lib/api';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { m } from '$lib/paraglide/messages';

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        const { request, params, cookies } = event;

        const formData: FormData = await request.formData();
        const email: FormDataEntryValue | null = formData.get('email');
        const password: FormDataEntryValue | null = formData.get('password');

        if (!email || !password) {
            return fail(400, { error: 'Email and password are required' });
        }

        let data;

        try {
            const response = await axios.post('/api/auth', formData);
            data = response.data;
        } catch (error: any) {
            console.error(error);

            return fail(error?.response?.status ?? 400, {
                isSuccess: false,
                message: error?.response?.data?.error ?? m['common.error.default-message'](),
                language: params.language,
            });
        }

        cookies.set('user', JSON.stringify(data.user), {
            path: '/',
            httpOnly: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
        });

        throw redirect(
            303,
            `/${params.language}`,
            {
                type: 'success',
                message: data.message,
            },
            event
        );
    },
};
