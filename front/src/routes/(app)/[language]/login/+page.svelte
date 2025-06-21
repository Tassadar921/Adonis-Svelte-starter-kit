<script lang="ts">
    import Form from '#components/Form.svelte';
    import Input from '#components/Input.svelte';
    import PasswordInput from '#components/PasswordInput.svelte';
    import { showToast } from '#services/toastService';
    import Title from '#components/Title.svelte';
    import Link from '#components/Link.svelte';
    import { m } from '$lib/paraglide/messages.js';
    import Breadcrumbs from '#components/Breadcrumbs.svelte';
    import OauthProviders from '#components/OauthProviders.svelte';
    import { navigate } from '#stores/locationStore';
    import { setProfile } from '#stores/profileStore';
    import Meta from '#components/Meta.svelte';

    let email: string = $state('');
    let password: string = $state('');
    let canSubmit: boolean = $state(false);

    async function handleSuccess(event: CustomEvent) {
        showToast(event.detail.message);
        setProfile(event.detail.user);
        await navigate('/');
    }

    $effect((): void => {
        canSubmit = !!email && !!password;
    });
</script>

<Meta
    title={m['login.meta.title']()}
    description={m['login.meta.description']()}
    keywords={m['login.meta.keywords']().split(', ')}
    languageAlternates={[
        {
            hrefLang: 'en',
            href: `${import.meta.env.VITE_FRONT_URI}/en/login`,
        },
        {
            hrefLang: 'fr',
            href: `${import.meta.env.VITE_FRONT_URI}/fr/login`,
        },
    ]}
/>

<Title title={m['login.title']()} hasBackground />

<Breadcrumbs hasBackground items={[{ label: m['home.title'](), path: '/' }, { label: m['login.title']() }]} />

<Form method="post" on:success={handleSuccess} isValid={canSubmit}>
    <OauthProviders />
    <Input type="email" name="email" placeholder={m['common.email.placeholder']()} label={m['common.email.label']()} bind:value={email} required />
    <PasswordInput name="password" bind:value={password} required />
    <div class="w-full mb-3 flex justify-between">
        <Link href="/reset-password" className="text-primary-500 hover:text-white duration-300 transition-colors">{m['login.forgot-password']()}</Link>
        <Link href="/create-account" className="text-primary-500 hover:text-white duration-300 transition-colors">{m['login.create-account']()}</Link>
    </div>
</Form>
