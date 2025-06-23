<script lang="ts">
    import Input from '#components/Input.svelte';
    import { m } from '$lib/paraglide/messages';
    import { onMount } from 'svelte';

    export let value: string = '';
    export let name: string = 'password';
    export let required: boolean = false;
    export let label: string = '';
    export let min: number | null = null;
    export let marginTop: number = 10;
    export let marginBottom: number = 5;

    let placeholder: string;

    onMount(() => {
        placeholder = m['common.password.placeholder']();
        if (!label) {
            label = m['common.password.label']();
        }
    });
</script>

<Input bind:value type="password" {name} {placeholder} {label} {min} {marginBottom} {marginTop} {required} />
