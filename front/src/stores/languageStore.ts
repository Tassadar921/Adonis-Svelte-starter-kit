import { browser } from '$app/environment';
import { type Writable, writable } from 'svelte/store';

export type LanguageCode = 'en' | 'fr';

export const language: Writable<LanguageCode> = writable('en');

export function setLanguage(value: LanguageCode): void {
    if (!browser) {
        return;
    }

    localStorage.setItem('language', value);
    language.set(value);
}
