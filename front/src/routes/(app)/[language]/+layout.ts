import { type LanguageCode, setLanguage } from '#stores/languageStore';
import { setLocale } from '../../../paraglide/runtime';
import axios from 'axios';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url, params }): Promise<{ language: string }> => {
    console.log('[routes/(app)/[language]/+layout.ts] params:', params);
    console.log('[routes/(app)/[language]/+layout.ts] url:', url.pathname);
    const language: LanguageCode = params.language as LanguageCode;

    setLanguage(language);
    setLocale(language);
    axios.defaults.headers.common['Accept-Language'] = `${language}-${language.toUpperCase()}`;

    return {
        language,
    };
};
