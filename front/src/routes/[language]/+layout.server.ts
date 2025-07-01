import { loadFlash, redirect } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';
import { type LanguageCode } from '#stores/languageStore';
import { supportedLanguages } from '#services/languageService';
import type SerializedUser from 'adonis-svelte-starter-kit-backend/app/types/serialized/serialized_user';
import { m } from '$lib/paraglide/messages';

export const load: LayoutServerLoad = loadFlash(async (event): Promise<{ language: LanguageCode; clearedPathName: string }> => {
    const { cookies, url, params } = event;
    const openedPathNames: string[] = ['/create-account', '/login', '/reset-password'];

    const languageCode: string = params.language?.replace('/', '') ?? cookies.get('language') ?? 'en';

    if (!supportedLanguages.includes(languageCode)) {
        redirect(307, `/en${url.pathname}`);
    }

    cookies.set('PARAGLIDE_LOCALE', languageCode, {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
    });

    const clearedPathName: string = url.pathname.replace(`/${languageCode}`, '') || '/';

    const userCookie: string | undefined = cookies.get('user');

    if (!userCookie) {
        if (openedPathNames.some((path: string): boolean => clearedPathName.startsWith(path))) {
            return { language: languageCode as LanguageCode, clearedPathName };
        } else {
            cookies.set('previousPathName', clearedPathName, {
                path: '/',
                httpOnly: false,
                sameSite: 'lax',
                maxAge: 60 * 60,
            });
            redirect(303, `/${languageCode}/login`);
        }
    }

    if (openedPathNames.some((path: string): boolean => clearedPathName.startsWith(path))) {
        redirect(304, `/${languageCode}`);
    } else {
        const user: SerializedUser = <SerializedUser>JSON.parse(userCookie);
        if (clearedPathName.startsWith('/admin') && user.role !== 'admin') {
            redirect(
                303,
                `/${languageCode}`,
                {
                    type: 'error',
                    message: m['forbidden.title'](),
                },
                event
            );
        } else {
            return { language: languageCode as LanguageCode, clearedPathName };
        }
    }
});
