import { loadFlash, redirect } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';
import type SerializedUser from 'adonis-svelte-starter-kit-backend/app/types/serialized/serialized_user';
import { m } from '$lib/paraglide/messages';

export const load: LayoutServerLoad = loadFlash(async (event): Promise<{ user?: SerializedUser; language: string; location: string }> => {
    const { cookies, url } = event;
    const openedPathNames: string[] = ['/create-account', '/login', '/reset-password'];

    const match: RegExpMatchArray | null = url.pathname.match(/^\/([a-z]{2})(\/|$)/);

    const urlLanguage: string | undefined = match ? match[1] : undefined;
    const language: string = cookies.get('PARAGLIDE_LOCALE') ?? 'en';

    console.log('ici : ', urlLanguage, url.pathname);
    if (!urlLanguage) {
        redirect(307, `/${language}${url.pathname}`);
    }

    const userCookie: string | undefined = cookies.get('user');
    const user: SerializedUser | undefined = userCookie ? <SerializedUser>JSON.parse(userCookie) : undefined;
    const location: string = url.pathname.replace(`/${language}`, '') || '/';

    if (!userCookie) {
        if (openedPathNames.some((path: string): boolean => location.startsWith(path))) {
            return { language, location };
        } else {
            // To redirect onto it after login
            cookies.set('previousPathName', location, {
                path: '/',
                httpOnly: false,
                sameSite: 'lax',
                maxAge: 60 * 60,
            });
            redirect(303, `${language}/login`);
        }
    }

    if (openedPathNames.some((path: string): boolean => location.startsWith(path))) {
        redirect(304, '/');
    } else {
        if (user && location.startsWith('/admin') && user.role !== 'admin') {
            redirect(
                303,
                `/${language}`,
                {
                    type: 'error',
                    message: m['forbidden.title'](),
                },
                event
            );
        }
    }

    return {
        user: userCookie ? <SerializedUser>JSON.parse(userCookie) : undefined,
        language,
        location,
    };
});
