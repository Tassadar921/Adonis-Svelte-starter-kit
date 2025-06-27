import type { Actions } from '@sveltejs/kit';
import axios from '$lib/api';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const formData: FormData = await request.formData();
        console.log('===================================================================');
        console.log('===================================================================');
        console.log('===================================================================');

        const email = formData.get('email');
        const password = formData.get('password');

        console.log('Form Values:', { email, password });

        if (!email || !password) {
            return fail(400, { error: 'Email and password are required' });
        }

        try {
            const { data } = await axios.post('/api/auth', formData);

            // cookies.set('token', data.token.token, {
            //     httpOnly: true,
            //     path: '/',
            //     maxAge: 60 * 60 * 24 * 7
            // });

            return {
                success: true,
                user: data.user,
                message: data.message,
            };
        } catch (error: any) {
            console.error(error);
            const message = error?.response?.data?.error ?? 'Something went wrong';
            return fail(400, { error: message });
        }
    },
};
