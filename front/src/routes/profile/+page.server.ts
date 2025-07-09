import type { Actions, RequestEvent } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { m } from '#lib/paraglide/messages';
import { client } from '#lib/api.server';

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        const { request, cookies } = event;

        const formData: FormData = await request.formData();
        const username: string | null = <string | null>formData.get('username');
        const profilePicture: File | null = <File | null>formData.get('profilePicture');

        console.log(profilePicture);

        let data: any;
        let isSuccess: boolean = true;

        try {
            const { data: returnedData } = await client.post('api/profile/update', {
                username,
                profilePicture,
            });
            data = returnedData;
        } catch (error: any) {
            console.log(error.response?.data?.errors);
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

            redirect(
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
