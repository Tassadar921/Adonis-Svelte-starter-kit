import type { LayoutLoad } from './$types';
import { setProfile } from '#stores/profileStore';
import { language } from '#stores/languageStore';
import { location } from '#stores/locationStore';

export const load: LayoutLoad = async ({ data }): Promise<void> => {
    if (data.user) {
        setProfile(data.user);
    }

    language.set(data.language);
    location.set(data.location);
};
