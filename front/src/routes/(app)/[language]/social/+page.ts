import { error } from '@sveltejs/kit';
import { profile } from '#stores/profileStore';
import { get } from 'svelte/store';

export function load({ params }): {} {
    console.log('social page params:', params);
    if (!get(profile)) {
        throw error(401);
    }

    return {};
}
