import { error } from '@sveltejs/kit';
import { profile } from '#stores/profileStore';

export function load(): void {
    if (profile) {
        throw error(409);
    }
}
