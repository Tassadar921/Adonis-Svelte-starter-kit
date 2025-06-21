import { type LanguageCode } from '#stores/languageStore';

export function load({ params }): { language: LanguageCode } {
    console.log('[routes/[language]/+page.ts] params:', params);
    const language: LanguageCode = params.language as LanguageCode;

    return {
        language,
    };
}
