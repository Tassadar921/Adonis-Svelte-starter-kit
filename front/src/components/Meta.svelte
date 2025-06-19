<script lang="ts">
    import { onMount } from 'svelte';
    import { MetaTags, type Twitter } from 'svelte-meta-tags';
    import { location } from '#stores/locationStore';
    import { language } from '#stores/languageStore';
    import { m } from '$lib/paraglide/messages.js';

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

    let images: OpenGraphImage[] = [
        {
            url: `${import.meta.env.VITE_FRONT_URI}/assets/logo-1200x1200.webp`,
            width: 1200,
            height: 1200,
            alt: `${m['open-graph.logo.alt']()}`,
        },
    ];
    let twitter: Twitter;

    onMount((): void => {
        twitter = {
            title,
            description,
            cardType: 'summary',
            site: import.meta.env.VITE_TWITTER_HANDLE,
        };
        if (additionalOpenGraphImages.length) {
            twitter.image = additionalOpenGraphImages[0].url;
            twitter.imageAlt = additionalOpenGraphImages[0].alt;
        } else {
            twitter.image = `${import.meta.env.VITE_FRONT_URI}/assets/logo-1200x1200.webp`;
            twitter.imageAlt = `${title}`;
        }
    });
</script>

<svelte:head>
    <MetaTags
        {title}
        {description}
        {keywords}
        {languageAlternates}
        openGraph={{
            type: 'website',
            title,
            description,
            url: `${import.meta.env.VITE_FRONT_URI}${$location}`,
            locale: $language,
            siteName: 'Adonis & Svelte Starter Kit',
            images: [
                {
                    url: `${import.meta.env.VITE_FRONT_URI}/assets/logo-1200x1200.webp`,
                    width: 1200,
                    height: 1200,
                    alt: `${m['open-graph.logo.alt']()}`,
                },
                ...images,
            ],
        }}
        {twitter}
    />
</svelte:head>
