import { browser } from '$app/environment';
import { type Writable, writable } from 'svelte/store';
import { goto } from '$app/navigation';
import { page } from '$app/stores';

export const location: Writable<string> = writable(window.location.pathname);

export async function navigate(path: string, options = {}): Promise<void> {
    if (!browser) return;
    const currentLanguage: string | null = localStorage.getItem('language');
    const normalizedPath: string = path.startsWith(`/${currentLanguage}`) ? path : `/${currentLanguage}${path}`;
    location.set(normalizedPath);
    await goto(normalizedPath, options);
}

if (browser) {
    window.addEventListener('popstate', (): void => {
        console.log('ici');
        location.set(window.location.pathname);
    });
}
