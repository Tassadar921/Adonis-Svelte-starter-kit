<script lang="ts">
    import Form from '#components/Form.svelte';
    import Title from '#components/Title.svelte';
    import { m } from '$lib/paraglide/messages';
    import OauthProviders from '#partials/login/OauthProviders.svelte';
    import Meta from '#components/Meta.svelte';
    import { Input } from '$lib/components/ui/input';
    import { isValidEmail } from '#services/checkStringService';
    import { Link } from '$lib/components/ui/link';

    let email: string = $state('');
    let password: string = $state('');
    let canSubmit = $derived((): boolean => isValidEmail(email) && !!password);
</script>

<Meta title={m['login.meta.title']()} description={m['login.meta.description']()} keywords={m['login.meta.keywords']().split(', ')} pathname="/login" />

<Title title={m['login.title']()} hasBackground />

<Form isValid={canSubmit()}>
    <OauthProviders />
    <Input type="email" name="email" placeholder={m['common.email.placeholder']()} label={m['common.email.label']()} bind:value={email} required />
    <Input type="password" name="password" placeholder={m['common.password.placeholder']()} label={m['common.password.label']()} bind:value={password} required />
    <div class="w-full flex justify-between">
        <Link href="/reset-password">{m['login.forgot-password']()}</Link>
        <Link href="/create-account">{m['login.create-account']()}</Link>
    </div>
</Form>
