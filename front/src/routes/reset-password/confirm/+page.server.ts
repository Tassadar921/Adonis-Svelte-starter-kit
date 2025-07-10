import { type Actions, type RequestEvent } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { client } from '#lib/api.server';
import type { PageDataError } from '../../../app';
import { extractFormErrors } from '#services/requestService';

export const actions: Actions = {
    default: async (event: RequestEvent): Promise<void> => {
        const { url, request, cookies } = event;
        const token: string | null = url.searchParams.get('token');

        const formData: FormData = await request.formData();

        let data: any;
        let isSuccess: boolean = true;

        const form = new FormData();
        form.append('password', formData.get('password') || '');
        form.append('confirmPassword', formData.get('confirm-password') || '');

        try {
            const { data: returnedData } = await client.post(`api/reset-password/confirm/${token}`, form, {
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
                `${cookies.get('user') ? `/${cookies.get('PARAGLIDE_LOCALE')}` : `/${cookies.get('PARAGLIDE_LOCALE')}/login`}`,
                {
                    type: 'success',
                    message: data?.message,
                },
                event
            );
        } else {
            const errors: PageDataError[] = extractFormErrors(data);

            cookies.set('formErrors', JSON.stringify(errors.slice(1)), {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
            });

            redirect(`/${cookies.get('PARAGLIDE_LOCALE')}/login`, errors[0], event);
        }
    },
};
