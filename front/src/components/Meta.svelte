<script lang="ts">
    import { MetaTags, type Twitter } from 'svelte-meta-tags';
    import { location } from '#stores/locationStore';
    import { language } from '#stores/languageStore';
    import { m } from '$lib/paraglide/messages.js';
    import { get } from 'svelte/store';

    interface LanguageAlternate {
        hrefLang: string;
        href: string;
    }

    interface OpenGraphImage {
        url: string;
        width: number;
        height: number;
        alt: string;
    }

    export let title: string;
    export let description: string;
    export let keywords: string[];
    export let languageAlternates: LanguageAlternate[] = [];
    export let additionalOpenGraphImages: OpenGraphImage[] = [];

    let baseImage: OpenGraphImage = {
        url: `${import.meta.env.VITE_FRONT_URI}/assets/logo-1200x1200.webp`,
        width: 1200,
        height: 1200,
        alt: `${m['open-graph.logo.alt']()}`,
    };
    $: meta = {
        title,
        description,
        keywords,
        languageAlternates,
        openGraph: {
            type: 'website',
            title,
            description,
            url: `${import.meta.env.VITE_FRONT_URI}${get(location)}`,
            locale: get(language),
            siteName: 'Adonis & Svelte Starter Kit',
            images: [baseImage, ...additionalOpenGraphImages],
        },
        twitter: {
            title,
            description,
            cardType: 'summary',
            site: import.meta.env.VITE_TWITTER_HANDLE,
            image: additionalOpenGraphImages[0]?.url ?? baseImage.url,
            imageAlt: additionalOpenGraphImages[0]?.alt ?? title,
        } satisfies Twitter,
    };
</script>

<MetaTags {...meta} />
