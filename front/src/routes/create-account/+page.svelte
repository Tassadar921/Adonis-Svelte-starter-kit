<script lang="ts">
    import Form from '#components/Form.svelte';
    import { Title } from '#lib/components/ui/title';
    import { m } from '#lib/paraglide/messages';
    import { Input } from '#lib/components/ui/input';
    import { checkPassword, isValidEmail } from '#services/checkStringService';
    import OauthProviders from '#partials/login/OauthProviders.svelte';
    import Meta from '#components/Meta.svelte';
    import { Switch } from '#lib/components/ui/switch';
    import { page } from '$app/state';

    let username: string = $state('');
    let email: string = $state('');
    let password: string = $state('');
    let confirmPassword: string = $state('');
    let consent: boolean = $state(false);

    let canSubmit: boolean = $state(false);

    $effect((): void => {
        const errorData = page.data.formError?.data;
        if (errorData) {
            username = errorData.username ?? '';
            email = errorData.email ?? '';
            password = errorData.password ?? '';
            confirmPassword = errorData.confirmPassword ?? '';
            consent = errorData.consent ?? false;
        }
    });

    $effect((): void => {
        if (username && email && isValidEmail(email) && password && confirmPassword && consent) {
            const checkPasswordMessageKey = checkPassword(password, confirmPassword);
            canSubmit = !checkPasswordMessageKey;
        } else {
            canSubmit = false;
        }
    });
</script>

<Meta title={m['create-account.meta.title']()} description={m['create-account.meta.description']()} keywords={m['create-account.meta.keywords']().split(', ')} pathname="/create-account" />

<Title title={m['create-account.title']()} hasBackground />

<Form isValid={canSubmit}>
    <Input name="username" placeholder={m['common.username.placeholder']()} label={m['common.username.label']()} bind:value={username} required />
    <Input type="email" name="email" placeholder={m['common.email.placeholder']()} label={m['common.email.label']()} bind:value={email} required />
    <Input type="password" name="password" placeholder={m['common.password.placeholder']()} label={m['common.password.label']()} bind:value={password} required />
    <Input type="password" name="confirm-password" placeholder={m['common.confirm-password.placeholder']()} label={m['common.confirm-password.label']()} bind:value={confirmPassword} required />
    <Switch name="consent" label={m['common.consent']()} bind:checked={consent} required />
    {#snippet footer()}
        <OauthProviders />
    {/snippet}
</Form>
