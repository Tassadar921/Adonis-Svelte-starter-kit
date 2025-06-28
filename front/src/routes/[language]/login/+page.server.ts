import type { Actions } from '@sveltejs/kit';
import axios from '$lib/api';
import { fail } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';

export const actions: Actions = {
    default: async ({ request, params }) => {
        const formData: FormData = await request.formData();

        const email: FormDataEntryValue | null = formData.get('email');
        const password: FormDataEntryValue | null = formData.get('password');

        if (!email || !password) {
            return fail(400, { error: 'Email and password are required' });
        }

        try {
            const { data } = await axios.post('/api/auth', formData);

            return {
                message: data.message,
                isSuccess: true,
                user: data.user,
                language: params.language,
            };
        } catch (error: any) {
            console.log(error);
            return fail(error?.response?.status ?? 400, {
                isSuccess: false,
                message: error?.response?.data?.error ?? m['common.error.default-message'],
                language: params.language,
            });
        }
    },
};
