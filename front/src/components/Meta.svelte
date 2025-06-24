<script lang="ts">
    import { MetaTags, type Twitter } from 'svelte-meta-tags';
    import { location } from '#stores/locationStore';
    import { language } from '#stores/languageStore';
    import { m } from '$lib/paraglide/messages';
    import { get } from 'svelte/store';
    import { supportedLanguages } from '#services/languageService';
    import { PUBLIC_FRONT_URI, PUBLIC_TWITTER_HANDLE } from '$env/static/public';

    interface OpenGraphImage {
        url: string;
        width: number;
        height: number;
        alt: string;
    }

    export let title: string;
    export let description: string;
    export let keywords: string[];
    export let pathname: string = '';
    export let additionalOpenGraphImages: OpenGraphImage[] = [];

    let baseImage: OpenGraphImage = {
        url: `${PUBLIC_FRONT_URI}/assets/logo-1200x1200.webp`,
        width: 1200,
        height: 1200,
        alt: `${m['open-graph.logo.alt']()}`,
    };
    $: meta = {
        title,
        description,
        keywords,
        languageAlternates: pathname
            ? supportedLanguages.map((language: string) => ({
                  hrefLang: language,
                  href: `${PUBLIC_FRONT_URI}/${language}${pathname}`,
              }))
            : [],
        openGraph: {
            type: 'website',
            title,
            description,
            url: `${PUBLIC_FRONT_URI}${get(location)}`,
            locale: get(language),
            siteName: 'Adonis & Svelte Starter Kit',
            images: [baseImage, ...additionalOpenGraphImages],
        },
        twitter: {
            title,
            description,
            cardType: 'summary',
            site: PUBLIC_TWITTER_HANDLE,
            image: additionalOpenGraphImages[0]?.url ?? baseImage.url,
            imageAlt: additionalOpenGraphImages[0]?.alt ?? title,
        } satisfies Twitter,
    };
</script>

<MetaTags {...meta} />
