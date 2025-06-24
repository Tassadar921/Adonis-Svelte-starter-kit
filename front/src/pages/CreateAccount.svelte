<script lang="ts">
    import Form from '#components/Form.svelte';
    import PasswordInput from '#components/PasswordInput.svelte';
    import Title from '#components/Title.svelte';
    import { showToast } from '#services/toastService';
    import { m } from '$lib/paraglide/messages';
    import Input from '#components/Input.svelte';
    import { checkPassword, isValidEmail } from '#services/checkStringService';
    import Switch from '#components/Switch.svelte';
    import OauthProviders from '#components/OauthProviders.svelte';
    import Meta from '#components/Meta.svelte';

    let username: string = $state('');
    let email: string = $state('');
    let password: string = $state('');
    let confirmPassword: string = $state('');
    let consent: boolean = $state(false);

    let canSubmit: boolean = $state(false);
    let message: string = $state('');

    const handleSuccess = (event: CustomEvent): void => {
        showToast(event.detail.message);
    };

    $effect((): void => {
        if (username && email && isValidEmail(email) && password && confirmPassword && consent) {
            const checkPasswordMessageKey = checkPassword(password, confirmPassword);
            if (checkPasswordMessageKey) {
                message = m[checkPasswordMessageKey]();
                canSubmit = false;
            } else {
                canSubmit = true;
            }
        }
    });
</script>

<Meta title={m['create-account.meta.title']()} description={m['create-account.meta.description']()} keywords={m['create-account.meta.keywords']().split(', ')} pathname="/create-account" />

<Title title={m['create-account.title']()} hasBackground />

<Form isValid={canSubmit}>
    <OauthProviders />
    <Input name="username" placeholder={m['common.username.placeholder']()} label={m['common.username.label']()} bind:value={username} required />
    <Input type="email" name="email" placeholder={m['common.email.placeholder']()} label={m['common.email.label']()} bind:value={email} required />
    <PasswordInput name="password" bind:value={password} required />
    <PasswordInput name="confirmPassword" label={m['common.confirm-password.label']()} bind:value={confirmPassword} required />
    <Switch name="consent" size={6} label={m['common.consent']()} bind:value={consent} required />
</Form>

{#if message}
    <p class="text-red-500 text-sm mt-2">{message}</p>
{/if}
