<script lang="ts">
    import Title from '../shared/Title.svelte';
    import Subtitle from '../shared/Subtitle.svelte';
    import { t } from 'svelte-i18n';
    import BackTo from '../shared/BackTo.svelte';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import { MetaTags } from 'svelte-meta-tags';
</script>

<meta name="robots" content="noindex, nofollow" />
<MetaTags
    title={$t('forbidden.meta.title')}
    description={$t('forbidden.meta.description')}
    keywords={$t('forbidden.meta.keywords').split(', ')}
    openGraph={{
        title: $t('forbidden.meta.title'),
        description: $t('forbidden.meta.description'),
    }}
    twitter={{
        title: $t('forbidden.meta.title'),
        description: $t('forbidden.meta.description'),
    }}
/>

<Breadcrumbs hasBackground items={[{ label: $t('home.title'), path: '/' }, { label: $t('forbidden.title') }]} />

<div class="absolute top-0 left-0 w-full h-screen flex flex-col justify-center items-center text-center pointer-events-none">
    <div class="flex flex-col gap-5 pointer-events-auto">
        <Title title={$t('forbidden.title')} />
        <Subtitle>{$t('forbidden.subtitle')}</Subtitle>
        <BackTo href="/login" text={$t('login.title')} />
    </div>
</div>
