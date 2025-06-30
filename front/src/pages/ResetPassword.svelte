<script lang="ts">
    import { Title } from '$lib/components/ui/title';
    import Form from '#components/Form.svelte';
    import Input from '#components/Input.svelte';
    import { onMount } from 'svelte';
    import { showToast } from '#services/toastService';
    import { m } from '$lib/paraglide/messages';
    import { profile } from '#stores/profileStore';
    import { isValidEmail } from '#services/checkStringService';
    import Breadcrumbs from '#components/Breadcrumbs.svelte';
    import Meta from '#components/Meta.svelte';

    let email: string = $state('');
    let readonly: boolean = $state(false);
    let canSubmit: boolean = $state(false);

    onMount(async (): Promise<void> => {
        if ($profile && $profile.email) {
            email = $profile.email;
            readonly = true;
        }
    });

    $effect((): void => {
        canSubmit = !!email && isValidEmail(email);
    });
</script>

<Meta title={m['reset-password.meta.title']()} description={m['reset-password.meta.description']()} keywords={m['reset-password.meta.keywords']().split(', ')} pathname="/reset-password" />

<Title title={m['reset-password.title']()} hasBackground />

<Breadcrumbs items={[{ label: m['home.title'](), path: '/' }, { label: m['reset-password.title']() }]} />

<Form isValid={canSubmit}>
    <Input label={m['common.email.label']()} placeholder={m['common.email.placeholder']()} type="email" name="email" bind:value={email} required {readonly} />
</Form>
