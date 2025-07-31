import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
    const response: Response = await fetch('/admin/language');
    const { isSuccess, languages } = await response.json();

    return isSuccess && response.ok ? { isSuccess, languages } : { isSuccess: false };
};
