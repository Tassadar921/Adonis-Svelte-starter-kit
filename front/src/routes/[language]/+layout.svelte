<script lang="ts">
    import Menu from '#components/menu/Menu.svelte';
    import Footer from '#components/shared/Footer.svelte';
    import { type Component, onMount } from 'svelte';
    import { MetaTags, type Twitter } from 'svelte-meta-tags';
    import { t } from 'svelte-i18n';
    import { location } from '#stores/locationStore';
    import { language } from '#stores/languageStore';

    export let component: Component<any>;
    export let props: Record<string, any> = {};
    export let hasCustomTwitterImage: boolean = false;

    let twitter: Twitter;

    onMount((): void => {
        twitter = {
            cardType: 'summary',
            site: import.meta.env.VITE_TWITTER_HANDLE,
        };
        if (!hasCustomTwitterImage) {
            twitter.image = `${import.meta.env.VITE_FRONT_URI}/assets/logo-1200x1200.webp`;
            twitter.imageAlt = `${$t('open-graph.logo.alt')}`;
        }
    });
</script>

<div class="px-3.5 min-h-screen">
    <Menu />

    <svelte:component this={component} {...props} />
</div>

<MetaTags
    openGraph={{
        type: 'website',
        images: [
            {
                url: `${import.meta.env.VITE_FRONT_URI}/assets/logo-1200x1200.webp`,
                width: 1200,
                height: 1200,
                alt: `${$t('open-graph.logo.alt')}`,
            },
        ],
        url: `${import.meta.env.VITE_FRONT_URI}${$location}`,
        locale: $language,
        siteName: 'Adonis & Svelte Starter Kit',
    }}
    {twitter}
/>

<Footer />
