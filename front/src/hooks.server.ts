import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '#lib/paraglide/server';

const handleParaglide: Handle = ({ event, resolve }): Promise<Response> =>
    paraglideMiddleware(event.request, ({ request, locale }) => {
        event.request = request;

        return resolve(event, {
            transformPageChunk: ({ html }): string => html.replace('%paraglide.lang%', locale),
        });
    });

export const handle: Handle = handleParaglide;
