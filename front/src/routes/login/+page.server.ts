import type { Actions, RequestEvent } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { m } from '#lib/paraglide/messages';
import { tuyau } from '#lib/api.server';

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        const { request, params, cookies } = event;

        const formData: FormData = await request.formData();
        const email: string | null = <string | null>formData.get('email');
        const password: string | null = <string | null>formData.get('password');

        if (!email || !password) {
            return fail(400, { error: 'Email and password are required' });
        }

        try {
            console.log('coucou')
            const { data, error } = await tuyau.api.auth.$post({
                email,
                password,
            });
            console.log(data, error);

            if (data) {
                console.log(data.message)
                console.log(data.user.role)
                console.log(data.a)
            }
            // cookies.set('user', JSON.stringify(data.user), {
            //     path: '/',
            //     httpOnly: false,
            //     sameSite: 'lax',
            //     maxAge: 60 * 60 * 24 * 7,
            // });
            //
            // const previousPathName: string | undefined = cookies.get('previousPathName');
            // cookies.delete('previousPathName', { path: '/' });
            //
            // redirect(
            //     303,
            //     `/${params.language}${previousPathName ? `/${previousPathName}` : ''}`,
            //     {
            //         type: 'success',
            //         message: data?.message,
            //     },
            //     event
            // );
            throw new Error('test');
        } catch (error: any) {
            console.log(error);
            return fail(error?.response?.status ?? 400, {
                isSuccess: false,
                message: error?.response?.data?.error ?? m['common.error.default-message'](),
                language: params.language,
            });
        }
    },
};
