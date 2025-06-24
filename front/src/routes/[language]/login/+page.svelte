<script lang="ts">
    import Form from '#components/Form.svelte';
    import Input from '#components/Input.svelte';
    import PasswordInput from '#components/PasswordInput.svelte';
    import { showToast } from '#services/toastService';
    import Title from '#components/Title.svelte';
    import Link from '#components/Link.svelte';
    import { m } from '$lib/paraglide/messages';
    import Breadcrumbs from '#components/Breadcrumbs.svelte';
    import OauthProviders from '#components/OauthProviders.svelte';
    import Meta from '#components/Meta.svelte';

    let email: string = $state('');
    let password: string = $state('');
    let canSubmit: boolean = $state(false);

    $effect((): void => {
        canSubmit = !!email && !!password;
    });
</script>

<Meta title={m['login.meta.title']()} description={m['login.meta.description']()} keywords={m['login.meta.keywords']().split(', ')} pathname="/login" />

<Title title={m['login.title']()} hasBackground />

<Breadcrumbs items={[{ label: m['home.title'](), path: '/' }, { label: m['login.title']() }]} />

<Form isValid={canSubmit}>
    <OauthProviders />
    <Input type="email" name="email" placeholder={m['common.email.placeholder']()} label={m['common.email.label']()} bind:value={email} required />
    <PasswordInput name="password" bind:value={password} required />
    <div class="w-full mb-3 flex justify-between">
        <Link href="/reset-password" className="text-primary-500 hover:text-white duration-300 transition-colors">{m['login.forgot-password']()}</Link>
        <Link href="/create-account" className="text-primary-500 hover:text-white duration-300 transition-colors">{m['login.create-account']()}</Link>
    </div>
</Form>
