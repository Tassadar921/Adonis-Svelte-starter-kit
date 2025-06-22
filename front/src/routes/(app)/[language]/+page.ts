import { type LanguageCode } from '#stores/languageStore';

export function load({ params, url }): { language: LanguageCode } {
    console.log('[routes/(app)/[language]/+page.ts] params:', params);
    console.log('[routes/(app)/[language]/+page.ts] url:', url.pathname);
    const language: LanguageCode = params.language as LanguageCode;

    return {
        language,
    };
}
