import { type LanguageCode } from '#stores/languageStore';
import { redirect } from '@sveltejs/kit';

export async function load({ url }): Promise<{ language: LanguageCode }> {
    const supportedLanguages: string[] = ['en', 'fr'];
    const currentPath: string = url.pathname;

    if (currentPath.startsWith('/assets/') || currentPath.includes('.png') || currentPath.includes('.jpg') || currentPath.includes('.css') || currentPath.includes('.js')) {
        return { language: 'en' };
    }

    const langRegex = new RegExp(`^\/(${supportedLanguages.join('|')})(\/|$)`);
    const langMatch: RegExpMatchArray | null = langRegex.exec(currentPath);

    let language: LanguageCode | null = langMatch ? (langMatch[1] as LanguageCode) : null;

    if (!language || !supportedLanguages.includes(language)) {
        throw redirect(307, `/en`);
    }

    return { language };
}
