import { loadFlash, redirect } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';
import type SerializedUser from 'adonis-svelte-starter-kit-backend/app/types/serialized/serialized_user';
import { m } from '$lib/paraglide/messages';
import { type LanguageCode } from '#stores/languageStore';
import { locales } from '../paraglide/runtime';

export const load: LayoutServerLoad = loadFlash(async (event): Promise<{ user?: SerializedUser; language: LanguageCode; location: string }> => {
    const { cookies, url } = event;
    const openedPathNames: string[] = ['/create-account', '/login', '/reset-password'];

    const match: RegExpMatchArray | null = url.pathname.match(/^\/([a-z]{2})(\/|$)/);
    const urlLanguage: LanguageCode | undefined = match ? (match[1] as LanguageCode) : undefined;

    const language: LanguageCode = urlLanguage ?? 'en';

    if (!urlLanguage || !locales.includes(urlLanguage)) {
        return redirect(307, `/${language}${url.pathname}`);
    }

    if (urlLanguage !== cookies.get('PARAGLIDE_LOCALE')) {
        cookies.set('PARAGLIDE_LOCALE', urlLanguage, {
            path: '/',
            httpOnly: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365,
        });
    }

    const userCookie: string | undefined = cookies.get('user');
    const user: SerializedUser | undefined = userCookie ? <SerializedUser>JSON.parse(userCookie) : undefined;

    const location: string = url.pathname.replace(`/${language}/`, '/') || '/';

    if (!userCookie) {
        if (openedPathNames.some((path) => location.startsWith(path))) {
            return { language, location };
        } else {
            cookies.set('previousPathName', location, {
                path: '/',
                httpOnly: false,
                sameSite: 'lax',
                maxAge: 60 * 60,
            });
            return redirect(303, `/${language}/login`);
        }
    }

    if (openedPathNames.some((path) => location.startsWith(path))) {
        return redirect(303, `/${language}/`);
    }

    if (user && location.startsWith('/admin') && user.role !== 'admin') {
        return redirect(
            303,
            `/${language}`,
            {
                type: 'error',
                message: m['forbidden.title'](),
            },
            event
        );
    }

    return {
        user,
        language,
        location,
    };
});
