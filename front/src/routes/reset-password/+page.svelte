<script lang="ts">
    import { Title } from '#lib/components/ui/title';
    import Form from '#components/Form.svelte';
    import Input from '#components/Input.svelte';
    import { m } from '#lib/paraglide/messages';
    import { profile } from '#stores/profileStore';
    import { isValidEmail } from '#services/checkStringService';
    import Meta from '#components/Meta.svelte';

    let email: string = $state('');
    let readonly: boolean = $state(false);
    let canSubmit: boolean = $state(false);

    $effect((): void => {
        canSubmit = !!email && isValidEmail(email);
    });

    $effect((): void => {
        if ($profile && $profile.email) {
            email = $profile.email;
            readonly = true;
        }
    });
</script>

<Meta title={m['reset-password.meta.title']()} description={m['reset-password.meta.description']()} keywords={m['reset-password.meta.keywords']().split(', ')} pathname="/reset-password" />

<Title title={m['reset-password.title']()} hasBackground />

<Form isValid={canSubmit}>
    <Input label={m['common.email.label']()} placeholder={m['common.email.placeholder']()} type="email" name="email" bind:value={email} required {readonly} />
</Form>
