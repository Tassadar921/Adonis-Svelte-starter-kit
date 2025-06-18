import { error } from '@sveltejs/kit';

export function load(): void {
    throw error(404);
}
