<script lang="ts">
    import Form from '#components/Form.svelte';
    import { showToast } from '#services/toastService';
    import Title from '#components/Title.svelte';
    import { m } from '$lib/paraglide/messages';
    import OauthProviders from '#components/OauthProviders.svelte';
    import Meta from '#components/Meta.svelte';
    import { Input } from '$lib/components/ui/input';
    import { Button } from '$lib/components/ui/button';

    let email: string = $state('');
    let password: string = $state('');
    let canSubmit: boolean = $state(false);

    $effect((): void => {
        canSubmit = !!email && !!password;
    });
</script>

<Meta title={m['login.meta.title']()} description={m['login.meta.description']()} keywords={m['login.meta.keywords']().split(', ')} pathname="/login" />

<Title title={m['login.title']()} hasBackground />

<Form isValid={canSubmit}>
    <OauthProviders />
    <Input type="email" name="email" placeholder={m['common.email.placeholder']()} label={m['common.email.label']()} bind:value={email} required />
    <Input type="password" name="password" placeholder={m['common.password.placeholder']()} label={m['common.password.label']()} bind:value={password} required />
    <div class="w-full my-3 flex justify-between">
        <Button href="/reset-password" variant="link" class="bg-transparent">{m['login.forgot-password']()}</Button>
        <Button href="/create-account" variant="link">{m['login.create-account']()}</Button>
    </div>
</Form>
