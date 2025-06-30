import { loadFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';
import type SerializedUser from 'adonis-svelte-starter-kit-backend/app/types/serialized/serialized_user';

export const load: LayoutServerLoad = loadFlash(async ({ cookies }): Promise<{ user: SerializedUser } | undefined> => {
    const userCookie: string | undefined = cookies.get('user');

    if (userCookie) {
        return { user: <SerializedUser>JSON.parse(userCookie) };
    }
});
