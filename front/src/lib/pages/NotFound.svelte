<script lang="ts">
    import Title from '../shared/Title.svelte';
    import { t } from 'svelte-i18n';
    import BackTo from '../shared/BackTo.svelte';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import { MetaTags } from 'svelte-meta-tags';
</script>

<meta name="robots" content="noindex, nofollow" />
<MetaTags
    title={$t('not-found.meta.title')}
    description={$t('not-found.meta.description')}
    keywords={$t('not-found.meta.keywords').split(', ')}
    openGraph={{
        title: $t('not-found.meta.title'),
        description: $t('not-found.meta.description'),
    }}
    twitter={{
        title: $t('not-found.meta.title'),
        description: $t('not-found.meta.description'),
    }}
/>

<Breadcrumbs hasBackground items={[{ label: $t('home.title'), path: '/' }, { label: $t('not-found.title') }]} />

<div class="absolute top-0 left-0 w-full h-screen flex flex-col justify-center items-center text-center pointer-events-none">
    <div class="flex flex-col gap-5 pointer-events-auto">
        <Title title={$t('not-found.title')} />
        <BackTo href="/" text={$t('common.back-to-home')} />
    </div>
</div>
