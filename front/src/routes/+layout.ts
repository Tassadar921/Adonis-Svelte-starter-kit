import { location } from '#stores/locationStore';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ url }): void => {
    location.set(url.pathname);
};
