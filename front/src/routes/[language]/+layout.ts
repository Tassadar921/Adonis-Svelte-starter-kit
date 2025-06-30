import type { LayoutLoad } from './$types';
import { type LanguageCode, setLanguage } from '#stores/languageStore';
import { setLocale } from '../../paraglide/runtime';
import axios from '$lib/api';
import { location } from '#stores/locationStore';

export const load: LayoutLoad = async ({ data, url }): Promise<{ language: LanguageCode }> => {
    setLanguage(data.language as LanguageCode);
    setLocale(data.language as LanguageCode);
    axios.defaults.headers.common['Accept-Language'] = `${data.language}-${data.language.toUpperCase()}`;
    location.set(data.clearedPathName);

    return { language: data.language as LanguageCode };
};
