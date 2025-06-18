<script lang="ts">
    import { page } from '$app/state';
    import Title from "#components/Title.svelte";
    import BackTo from "#components/BackTo.svelte";
    import {MetaTags} from "svelte-meta-tags";
    import Breadcrumbs from "#components/Breadcrumbs.svelte";
    import { m } from '$lib/paraglide/messages.js';

    let key: 'unauthorized' | 'forbidden' | 'not-found' | 'already-connected' | 'unknown-error' = 'unknown-error';
    switch (page.status) {
        case 401:
            key = 'unauthorized';
            break;
        case 403:
            key = 'forbidden';
            break;
        case 404:
            key = 'not-found';
            break;
        case 409:
            key = 'already-connected';
            break;
        default:
            key = 'unknown-error';
    }
</script>

<meta name="robots" content="noindex, nofollow" />
<MetaTags
    title={m[`${key}.meta.title`]()}
    description={m[`${key}.meta.description`]()}
    keywords={m[`${key}.meta.keywords`]().split(', ')}
    openGraph={{
        title: m[`${key}.meta.title`](),
        description: m[`${key}.meta.description`](),
    }}
    twitter={{
        title: m[`${key}.meta.title`](),
        description: m[`${key}.meta.description`](),
    }}
/>

<Breadcrumbs hasBackground items={[{ label: m['home.title'](), path: '/' }, { label: m[`${key}.title`]() }]} />

<div class="absolute top-0 left-0 w-full h-screen flex flex-col justify-center items-center text-center pointer-events-none">
    <div class="flex flex-col gap-5 pointer-events-auto">
        <Title title={m[`${key}.title`]()} />
        <BackTo href="/" text={m['common.back-to-home']()} />
    </div>
</div>
