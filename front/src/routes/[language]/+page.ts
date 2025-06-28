import { error } from '@sveltejs/kit';
import { profile } from '#stores/profileStore';
import { get } from 'svelte/store';

export function load(): {} {
    console.log('ici', get(profile));
    if (!get(profile)) {
        console.log('aaaa')
        throw error(401);
    }

    console.log('bbbbbb')

    return {};
}
