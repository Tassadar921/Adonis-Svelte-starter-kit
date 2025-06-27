import { browser } from '$app/environment';
import { get, writable, type Writable } from 'svelte/store';
import { goto } from '$app/navigation';
import { language } from '#stores/languageStore';

export const location: Writable<string> = writable('');

export async function navigate(path: string, options = {}): Promise<void> {
    if (!browser) {
        return;
    }

    const normalizedPath: string = path.startsWith(`/${get(language)}`) ? path : `/${get(language)}${path}`;

    location.set(normalizedPath);
    await goto(normalizedPath, options);
}
