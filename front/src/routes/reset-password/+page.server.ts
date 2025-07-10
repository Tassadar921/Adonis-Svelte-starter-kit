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
            const { data: returnedData } = await client.post('api/reset-password/send-mail', formData, {
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
            redirect(
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
