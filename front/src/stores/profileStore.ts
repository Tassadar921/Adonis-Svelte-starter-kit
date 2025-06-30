import { type Writable, writable } from 'svelte/store';
import axios from 'axios';
import { showToast } from '#services/toastService';
import type SerializedUser from 'adonis-svelte-starter-kit-backend/app/types/serialized/serialized_user';

export const profile: Writable<SerializedUser | null> = writable(null);

export function setProfile(user: SerializedUser): void {
    profile.set(user);
}

export async function updateProfile(): Promise<void> {
    try {
        const { data } = await axios.get('/api/profile');
        setProfile(data.user);
    } catch (error: any) {
        showToast(error.response.data.error, 'error');
    }
}

export function clearProfile(): void {
    profile.set(null);
}
