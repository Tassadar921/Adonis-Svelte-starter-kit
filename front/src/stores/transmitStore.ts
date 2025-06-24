import { type Writable, writable } from 'svelte/store';
import { Transmit } from '@adonisjs/transmit-client';
import { browser } from '$app/environment';
import { PUBLIC_API_TRANSMIT_URI } from '$env/static/public';

export const transmit: Writable<Transmit | undefined> = writable(undefined);

if (browser) {
    const client = new Transmit({ baseUrl: PUBLIC_API_TRANSMIT_URI });
    transmit.set(client);
}
