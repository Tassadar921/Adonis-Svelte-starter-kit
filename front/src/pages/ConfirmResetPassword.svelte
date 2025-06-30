<script lang="ts">
    import Form from '#components/Form.svelte';
    import { Title } from '$lib/components/ui/title';
    import { m } from '$lib/paraglide/messages';
    import { checkPassword } from '#services/checkStringService';
    import Meta from '#components/Meta.svelte';
    import {Input} from "$lib/components/ui/input";

    interface Props {
        token: string;
    }

    let { token }: Props = $props();

    let password: string = $state('');
    let confirmPassword: string = $state('');
    let canSubmit: boolean = $state(false);
    let message: string = $state('');

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

<Form isValid={canSubmit}>
    <Input type="password" name="password" placeholder={m['common.password.placeholder']()} label={m['common.password.label']()} bind:value={password} required />
    <Input type="password" name="confirm-password" placeholder={m['common.confirm-password.placeholder']()} label={m['common.confirm-password.label']()} bind:value={confirmPassword} required />
</Form>

{#if message}
    <p class="text-red-500 text-sm mt-2">{message}</p>
{/if}
