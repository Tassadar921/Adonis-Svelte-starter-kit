import { type LanguageCode, setLanguage } from '#stores/languageStore';
import { setLocale } from '../../../paraglide/runtime';
import axios from 'axios';

export function load({ params }): { language: LanguageCode } {
    console.log('[(app)/[language]/+layout.ts] params:', params);
    const language: LanguageCode = params.language as LanguageCode;

    setLanguage(language);
    setLocale(language);
    axios.defaults.headers.common['Accept-Language'] = `${language}-${language.toUpperCase()}`;

    return {
        language,
    };
}
