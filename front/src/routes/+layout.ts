import type { LayoutLoad } from './$types';
import { setProfile } from '#stores/profileStore';

export const load: LayoutLoad = async ({ data }): Promise<void> => {
    if (data.user) {
        setProfile(data.user);
    }
};
