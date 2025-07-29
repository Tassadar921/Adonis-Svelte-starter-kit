// +page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
    const response: Response = await fetch('/social/blocked');

    if (!response.ok) {
        return {
            isSuccess: false,
        };
    }

    const data = await response.json();

    return {
        isSuccess: true,
        blockedUsers: data.blockedUsers,
    };
};
