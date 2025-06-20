import { type LanguageCode } from '#stores/languageStore';

export function load({ params }): { language: LanguageCode } {
    console.log('[language page] params:', params);
    const language: LanguageCode = params.language as LanguageCode;

    return {
        language,
    };
}
