import { PUBLIC_API_BASE_URI } from '$env/static/public';
import { createTuyau, type TuyauClient } from '@tuyau/client';
import { api, type ApiDefinition } from '#backend/.adonisjs/api';

export const initializeTuyau = (language: string): void => {
    tuyau = createTuyau({
        api,
        baseUrl: PUBLIC_API_BASE_URI,
        headers: {
            'Accept-Language': language,
        },
    });
};

export let tuyau: TuyauClient<ApiDefinition, readonly []> = createTuyau({
    api,
    baseUrl: PUBLIC_API_BASE_URI,
    headers: {
        'Accept-Language': 'en',
    },
});
