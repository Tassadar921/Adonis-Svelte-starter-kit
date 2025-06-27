import type { Actions } from '@sveltejs/kit';
import axios from '$lib/api';
import { fail } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const formData: FormData = await request.formData();

        const email: FormDataEntryValue | null = formData.get('email');
        const password: FormDataEntryValue | null = formData.get('password');

        if (!email || !password) {
            return fail(400, { error: 'Email and password are required' });
        }

        try {
            const { data } = await axios.post('/api/auth', formData);

            const expiresAt: Date = new Date(data.token.expiresAt);
            const now: Date = new Date();

            cookies.set('token', data.token.token, {
                httpOnly: true,
                path: '/',
                maxAge: Math.floor((expiresAt.getTime() - now.getTime()) / 1000),
            });

            console.log(data);

            return {
                message: data.message,
                isSuccess: true,
                profile: data.user,
            };
        } catch (error: any) {
            return fail(error?.response?.status ?? 400, { isSuccess: false, message: error?.response?.data?.error ?? m['common.error.default-message'] });
        }
    },
};
