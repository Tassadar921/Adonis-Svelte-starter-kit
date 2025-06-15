import { type Writable, writable } from 'svelte/store';
import { browser } from '$app/environment';

// Initialisation côté client uniquement
let transmitInstance: any = null;

if (browser) {
    import('@adonisjs/transmit-client')
        .then(({ Transmit }) => {
            const baseUrl: string = import.meta.env.VITE_API_BASE_URI;
            if (!baseUrl) {
                console.error('VITE_API_BASE_URI is not defined');
                return;
            }
            transmitInstance = new Transmit({ baseUrl });
            transmit.set(transmitInstance);
        })
        .catch(console.error);
}

export const transmit: Writable<any> = writable(transmitInstance);
