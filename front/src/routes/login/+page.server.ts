import { type Actions, fail, type RequestEvent } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { client } from '#lib/api.server';
import type { FormError } from '../../app';
import { extractFormData, extractFormErrors } from '#services/requestService';

export const actions: Actions = {
    default: async (event: RequestEvent): Promise<void> => {
        const { request, cookies } = event;

        const formData: FormData = await request.formData();

        let data: any;
        let isSuccess: boolean = true;

        try {
            formData.append('confirmPassword', <string>formData.get('confirm-password'));
            formData.delete('confirm-password');
            const { data: returnedData } = await client.post('api/auth', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
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
                `/${cookies.get('PARAGLIDE_LOCALE')}${previousPathName ? `${previousPathName}` : ''}`,
                {
                    type: 'success',
                    message: data?.message,
                },
                event
            );
        } else {
            const form: FormError = {
                data: extractFormData(formData),
                errors: extractFormErrors(data),
            };

            cookies.set('formError', JSON.stringify(form), {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
            });

            fail(400);
        }
    },
};
