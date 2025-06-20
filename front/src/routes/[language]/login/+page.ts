import { error } from '@sveltejs/kit';
import { profile } from '#stores/profileStore';
import { get } from 'svelte/store';

export function load({ params }): {} {
    console.log('login page params:', params);
    if (get(profile)) {
        throw error(409);
    }

    return {};
}
