<script lang="ts">
    import Card from '#components/Card.svelte';
    import { m } from '$lib/paraglide/messages';
    import Title from '#components/Title.svelte';
    import Breadcrumbs from '#components/Breadcrumbs.svelte';
    import Meta from '#components/Meta.svelte';

    interface Page {
        title: string;
        icon: string;
        href: string;
        description: string;
    }

    const pages: Page[] = [
        {
            title: m['social.friends.title'](),
            icon: 'people',
            href: '/social/friends',
            description: m['social.friends.description'](),
        },
        {
            title: m['social.blocked.title'](),
            icon: 'stop',
            href: '/social/blocked',
            description: m['social.blocked.description'](),
        },
        {
            title: m['profile.title'](),
            icon: 'user',
            href: '/profile',
            description: m['profile.description'](),
        },
    ];
</script>

<Meta title={m['social.meta.title']()} description={m['social.meta.description']()} keywords={m['social.meta.keywords']().split(', ')} pathname="/social" />

<Title title={m['social.title']()} />

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
    {#each pages as page}
        <Card title={page.title} icon={page.icon} href={page.href} description={page.description} />
    {/each}
</div>
