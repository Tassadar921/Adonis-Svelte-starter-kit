import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }): never => {
    redirect(307, `/${cookies.get('PARAGLIDE_LOCALE') ?? 'en'}`);
};
