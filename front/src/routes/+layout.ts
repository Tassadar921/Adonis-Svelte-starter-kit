import { type LanguageCode } from '#stores/languageStore';
import { redirect } from '@sveltejs/kit';

export async function load({ url }): Promise<{ language: string }> {
    const supportedLanguages: string[] = ['en', 'fr'];
    const currentPath: string = url.pathname;

    if (currentPath.startsWith('/assets/') || currentPath.match(/\.(png|jpe?g|webp|svg|css|js)$/)) {
        return { language: 'en' };
    }

    const match: RegExpMatchArray | null = /^\/(en|fr)(\/|$)/.exec(currentPath);
    const languageCode: LanguageCode | null = match ? (match[0].replaceAll('/', '') as LanguageCode) : null;

    if (!languageCode || !supportedLanguages.includes(languageCode)) {
        throw redirect(307, `/en${currentPath}`);
    }

    console.log('[layout] params:', { language: languageCode });

    return { language: languageCode };
}
