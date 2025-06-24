<script lang="ts">
    import Form from '../../../../front/src/components/Form.svelte';
    import PasswordInput from '../../../../front/src/components/PasswordInput.svelte';
    import Title from '../../../../front/src/components/Title.svelte';
    import { showToast } from '../../../../front/src/services/toastService';
    import { t } from 'svelte-i18n';
    import Input from '../../../../front/src/components/Input.svelte';
    import { checkPassword, isValidEmail } from '../../../../front/src/services/checkStringService';
    import Switch from '../../../../front/src/components/Switch.svelte';
    import OauthProviders from '../../../../front/src/components/OauthProviders.svelte';
    import { MetaTags } from 'svelte-meta-tags';

    let username: string = '';
    let email: string = '';
    let password: string = '';
    let confirmPassword: string = '';
    let consent: boolean = false;

    let canSubmit: boolean = false;
    let message: string = '';

    const handleSuccess = (event: CustomEvent): void => {
        showToast(event.detail.message);
    };

    $: {
        if (username && email && isValidEmail(email) && password && confirmPassword && consent) {
            message = $t(checkPassword(password, confirmPassword));
            canSubmit = password === confirmPassword && !message;
        }
    }
</script>

<MetaTags
    title={$t('create-account.meta.title')}
    description={$t('create-account.meta.description')}
    keywords={$t('create-account.meta.keywords').split(', ')}
    languageAlternates={[
        {
            hrefLang: 'en',
            href: `${import.meta.env.PUBLIC_FRONT_URI}/en/create-account`,
        },
        {
            hrefLang: 'fr',
            href: `${import.meta.env.PUBLIC_FRONT_URI}/fr/create-account`,
        },
    ]}
    openGraph={{
        title: $t('create-account.meta.title'),
        description: $t('create-account.meta.description'),
    }}
    twitter={{
        title: $t('create-account.meta.title'),
        description: $t('create-account.meta.description'),
    }}
/>

<Title title={$t('create-account.title')} hasBackground={true} />

<Form action="/api/account-creation/send-mail" method="POST" on:success={handleSuccess} bind:isValid={canSubmit}>
    <OauthProviders />
    <Input name="username" placeholder={$t('common.username.placeholder')} label={$t('common.username.label')} bind:value={username} required={true} />
    <Input type="email" name="email" placeholder={$t('common.email.placeholder')} label={$t('common.email.label')} bind:value={email} required={true} />
    <PasswordInput name="password" bind:value={password} required />
    <PasswordInput name="confirmPassword" label={$t('common.confirm-password.label')} bind:value={confirmPassword} required />
    <Switch name="consent" size={6} label={$t('common.consent')} bind:value={consent} required={true} />
</Form>

{#if message}
    <p class="text-red-500 text-sm mt-2">{message}</p>
{/if}
