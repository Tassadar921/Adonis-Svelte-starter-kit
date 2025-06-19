import { error } from '@sveltejs/kit';
import { profile } from '#stores/profileStore';
import { get } from 'svelte/store';

export function load(): {} {
    if (get(profile)) {
        throw error(409);
    }

    return {};
}
