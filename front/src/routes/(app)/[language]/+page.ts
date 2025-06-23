import { type LanguageCode } from '#stores/languageStore';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, params }): Promise<{ language: string }> => {
    console.log('[routes/(app)/[language]/+page.ts] params:', params);
    console.log('[routes/(app)/[language]/+page.ts] url:', url.pathname);
    const language: LanguageCode = params.language as LanguageCode;

    return {
        language,
    };
};
