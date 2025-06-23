import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { type LanguageCode, setLanguage } from '#stores/languageStore';
import { setLocale } from '../../paraglide/runtime';
import axios from 'axios';

export const load: LayoutLoad = async ({ params, url }): Promise<{ language: LanguageCode }> => {
    const supportedLanguages: string[] = ['en', 'fr'];
    const languageCode: string = params.language;

    if (!languageCode || !supportedLanguages.includes(languageCode)) {
        throw redirect(307, `/en${url.pathname}`);
    }

    setLanguage(languageCode as LanguageCode);
    setLocale(languageCode as LanguageCode);
    axios.defaults.headers.common['Accept-Language'] = `${languageCode}-${languageCode.toUpperCase()}`;

    return { language: languageCode as LanguageCode };
};
