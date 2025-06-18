import { error } from '@sveltejs/kit';
import { profile } from '#stores/profileStore';
import { get } from 'svelte/store';

export function load(): void {
    if (get(profile)) {
        throw error(409);
    }
}
