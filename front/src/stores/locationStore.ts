import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';
import { goto } from '$app/navigation';
import { page } from '$app/state';

export const location: Writable<string> = writable('');

if (browser) {
    location.set(page.url.pathname);

    window.addEventListener('popstate', (): void => {
        location.set(window.location.pathname);
    });
}

// Navigation function with language prefix logic
export async function navigate(path: string, options = {}): Promise<void> {
    if (!browser) return;

    const currentLanguage: string | null = localStorage.getItem('language');
    const normalizedPath: string =
        path.startsWith(`/${currentLanguage}`) ? path : `/${currentLanguage}${path}`;

    location.set(normalizedPath);
    await goto(normalizedPath, options);
}
