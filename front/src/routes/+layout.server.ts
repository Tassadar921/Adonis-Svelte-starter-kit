import { loadFlash, redirect } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';
import type { SerializedUser } from 'backend/types';
import { m } from '#lib/paraglide/messages';
import { type LanguageCode } from '#stores/languageStore';
import { locales } from '../paraglide/runtime';
import { client } from '#lib/api.server';

export const load: LayoutServerLoad = loadFlash(async (event): Promise<{ user?: SerializedUser; language: LanguageCode; location: string }> => {
    const { cookies, url } = event;
    const openedPathNames: string[] = ['/create-account', '/login', '/oauth', '/reset-password'];

    const match: RegExpMatchArray | null = url.pathname.match(/^\/([a-z]{2})(\/|$)/);
    const language: LanguageCode | undefined = match ? (match[1] as LanguageCode) : undefined;

    if (!language || !locales.includes(language)) {
        return redirect(307, `/${cookies.get('PARAGLIDE_LOCALE') ?? 'en'}${url.pathname}`);
    }

    if (language !== cookies.get('PARAGLIDE_LOCALE')) {
        cookies.set('PARAGLIDE_LOCALE', language, {
            path: '/',
            httpOnly: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365,
        });
    }

    client.defaults.headers.common['Accept-Language'] = `${language}-${language.toUpperCase()}`;

    const userCookie: string | undefined = cookies.get('user');
    const user: SerializedUser | undefined = userCookie ? <SerializedUser>JSON.parse(userCookie) : undefined;

    const location: string = url.pathname.replace(`/${language}`, '') || '/';

    if (!userCookie) {
        if (openedPathNames.some((path: string): boolean => location.startsWith(path))) {
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

    if (cookies.get('token')) {
        client.defaults.headers.common['Authorization'] = `Bearer ${cookies.get('token')}`;
    } else {
        client.defaults.headers.common['Authorization'] = undefined;
        cookies.delete('token', { path: '/' });
        cookies.delete('user', { path: '/' });
        return redirect(303, `/${language}/login`);
    }

    if (openedPathNames.some((path: string): boolean => location.startsWith(path))) {
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
