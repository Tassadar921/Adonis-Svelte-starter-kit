import { error } from '@sveltejs/kit';
import { profile } from '#stores/profileStore';
import { get } from 'svelte/store';

export function load({ data, params }): {} {
    console.log('là', get(profile));
    if (get(profile)) {
        throw error(409);
    }

    console.log(data);

    return data ?? {};
}
