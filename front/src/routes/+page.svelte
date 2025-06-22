<script lang="ts">
    import Card from '#components/Card.svelte';
    import { m } from '$lib/paraglide/messages.js';
    import Title from '#components/Title.svelte';
    import Meta from '#components/Meta.svelte';

    interface Page {
        title: string;
        icon: string;
        href: string;
        description: string;
    }

    const pages: Page[] = [
        {
            title: m['social.title'](),
            icon: 'people',
            href: '/social',
            description: m['social.description'](),
        },
    ];
</script>

<Meta
    title={m['home.meta.title']()}
    description={m['home.meta.description']()}
    keywords={m['home.meta.keywords']().split(', ')}
    languageAlternates={[
        {
            hrefLang: 'en',
            href: `${import.meta.env.VITE_FRONT_URI}/en`,
        },
        {
            hrefLang: 'fr',
            href: `${import.meta.env.VITE_FRONT_URI}/fr`,
        },
    ]}
/>

<Title title={m['home.title']()} />

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
    {#each pages as page}
        <Card title={page.title} icon={page.icon} href={page.href} description={page.description} />
    {/each}
</div>
