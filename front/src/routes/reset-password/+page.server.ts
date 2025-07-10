import { type Actions, fail, type RequestEvent } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { client } from '#lib/api.server';
import type { PageDataError } from '../../app';
import { extractFormErrors } from '#services/requestService';

export const actions: Actions = {
    default: async (event: RequestEvent): Promise<void> => {
        const { request, cookies } = event;

        const formData: FormData = await request.formData();

        let data: any;
        let isSuccess: boolean = true;

        const form = new FormData();
        form.append('email', formData.get('email') || '');

        try {
            const { data: returnedData } = await client.post('api/reset-password/send-mail', form, {
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
            const errors: PageDataError[] = extractFormErrors(data);

            cookies.set('formErrors', JSON.stringify(errors), {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
            });

            fail(400);
        }
    },
};
