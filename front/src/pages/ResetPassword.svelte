<script lang="ts">
    import Title from '../../../../front/src/components/Title.svelte';
    import Form from '../../../../front/src/components/Form.svelte';
    import Input from '../../../../front/src/components/Input.svelte';
    import { onMount } from 'svelte';
    import { showToast } from '../../../../front/src/services/toastService';
    import { t } from 'svelte-i18n';
    import { profile } from '../../../../front/src/stores/profileStore';
    import { isValidEmail } from '../../../../front/src/services/checkStringService';
    import Breadcrumbs from '../../../../front/src/components/Breadcrumbs.svelte';
    import { MetaTags } from 'svelte-meta-tags';

    let email: string = '';
    let readonly: boolean = false;
    let canSubmit: boolean = false;

    onMount(async (): Promise<void> => {
        if ($profile && $profile.email) {
            email = $profile.email;
            readonly = true;
        }
    });

    const handleSuccess = (event: CustomEvent): void => {
        showToast(event.detail.message);
    };

    $: canSubmit = !!email && isValidEmail(email);
</script>

<MetaTags
    title={$t('reset-password.meta.title')}
    description={$t('reset-password.meta.description')}
    keywords={$t('reset-password.meta.keywords').split(', ')}
    languageAlternates={[
        {
            hrefLang: 'en',
            href: `${import.meta.env.VITE_FRONT_URI}/en/reset-password`,
        },
        {
            hrefLang: 'fr',
            href: `${import.meta.env.VITE_FRONT_URI}/fr/reset-password`,
        },
    ]}
    openGraph={{
        title: $t('reset-password.meta.title'),
        description: $t('reset-password.meta.description'),
    }}
    twitter={{
        title: $t('reset-password.meta.title'),
        description: $t('reset-password.meta.description'),
    }}
/>

<Title title={$t('reset-password.title')} hasBackground />

<Breadcrumbs hasBackground items={[{ label: $t('home.title'), path: '/' }, { label: $t('reset-password.title') }]} />

<Form action="/api/reset-password/send-mail" method="POST" on:success={handleSuccess} isValid={canSubmit}>
    <Input label={$t('common.email.label')} placeholder={$t('common.email.placeholder')} type="email" name="email" bind:value={email} required {readonly} />
</Form>
