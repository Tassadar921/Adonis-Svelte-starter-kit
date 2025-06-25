<script lang="ts">
    import Form from '#components/Form.svelte';
    import PasswordInput from '#components/PasswordInput.svelte';
    import Title from '#components/Title.svelte';
    import { showToast } from '#services/toastService';
    import { navigate } from '#stores/locationStore';
    import { m } from '$lib/paraglide/messages';
    import { checkPassword } from '#services/checkStringService';
    import { profile } from '#stores/profileStore';
    import Breadcrumbs from '#components/Breadcrumbs.svelte';
    import Meta from '#components/Meta.svelte';

    interface Props {
        token: string;
    }

    let { token }: Props = $props();

    let password: string = $state('');
    let confirmPassword: string = $state('');
    let canSubmit: boolean = $state(false);
    let message: string = $state('');

    const handleSuccess = (event: CustomEvent): void => {
        showToast(event.detail.message);
        if (!$profile) {
            navigate('/login');
        } else {
            navigate('/');
        }
    };

    $effect((): void => {
        if (password && confirmPassword) {
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

<meta name="robots" content="noindex, nofollow" />
<Meta
    title={m['reset-password.confirm.meta.title']()}
    description={m['reset-password.confirm.meta.description']()}
    keywords={m['reset-password.confirm.meta.keywords']().split(', ')}
    pathname={`/reset-password/confirm/${token}`}
/>

<Title title={m['reset-password.confirm.title']()} hasBackground />

<Breadcrumbs items={[{ label: m['home.title'](), path: '/' }, { label: m['reset-password.confirm.title']() }]} />

<Form isValid={canSubmit}>
    <PasswordInput name="password" bind:value={password} />
    <PasswordInput name="confirmPassword" label={m['common.confirm-password.label']()} bind:value={confirmPassword} />
</Form>

{#if message}
    <p class="text-red-500 text-sm mt-2">{message}</p>
{/if}
