import { type Writable, writable } from 'svelte/store';
import { Transmit } from '@adonisjs/transmit-client';
import { PUBLIC_API_BASE_URI } from '$env/static/public';

const baseUrl: string = PUBLIC_API_BASE_URI;
if (!baseUrl) {
    throw new Error('PUBLIC_API_BASE_URI is not defined');
}

export const transmit: Writable<Transmit> = writable(new Transmit({ baseUrl }));
