<script lang="ts">
    import Form from '#components/Form.svelte';
    import { showToast } from '#services/toastService';
    import Title from '#components/Title.svelte';
    import { m } from '$lib/paraglide/messages';
    import OauthProviders from '#partials/login/OauthProviders.svelte';
    import Meta from '#components/Meta.svelte';
    import { Input } from '$lib/components/ui/input';
    import { Button } from '$lib/components/ui/button';
    import { isValidEmail } from '#services/checkStringService';
    import { setProfile, profile } from '#stores/profileStore';
    import { page } from '$app/state';

    let email: string = $state('');
    let password: string = $state('');
    let canSubmit: boolean = $state(false);

    $effect((): void => {
        if (!page.form) {
            return;
        }

        if (page.form.message) {
            showToast(page.form.message, page.form.isSuccess ? 'success' : 'error');
        }

        if (page.form.profile) {
            setProfile(page.form.profile);
        }

        console.log(page.form.profile, $profile);
    })

    $effect((): void => {
        canSubmit = isValidEmail(email) && !!password;
    });
</script>

<Meta title={m['login.meta.title']()} description={m['login.meta.description']()} keywords={m['login.meta.keywords']().split(', ')} pathname="/login" />

<Title title={m['login.title']()} hasBackground />

<Form isValid={canSubmit}>
    <OauthProviders />
    <Input type="email" name="email" placeholder={m['common.email.placeholder']()} label={m['common.email.label']()} bind:value={email} required />
    <Input type="password" name="password" placeholder={m['common.password.placeholder']()} label={m['common.password.label']()} bind:value={password} required />
    <div class="w-full flex justify-between">
        <Button href="/reset-password" variant="link" class="bg-transparent">{m['login.forgot-password']()}</Button>
        <Button href="/create-account" variant="link">{m['login.create-account']()}</Button>
    </div>
</Form>
