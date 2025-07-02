import type { LayoutLoad } from './$types';
import { setProfile } from '#stores/profileStore';
import { type LanguageCode, setLanguage } from '#stores/languageStore';
import axios from '$lib/api';
import { location } from '#stores/locationStore';

export const load: LayoutLoad = async ({ data }): Promise<void> => {
    if (data.user) {
        setProfile(data.user);
    }

    setLanguage(data.language as LanguageCode);
    axios.defaults.headers.common['Accept-Language'] = `${data.language}-${data.language.toUpperCase()}`;
    location.set(data.location);
};
