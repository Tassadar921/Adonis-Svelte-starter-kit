<script lang="ts">
    import Input from '#components/Input.svelte';
    import { m } from '$lib/paraglide/messages';

    type Props = {
        value: string;
        name: string;
        required?: boolean;
        label?: string;
        min?: number;
        marginTop: number;
        marginBottom: number;
    };

    let { value = $bindable(), name, required = false, label = m['common.password.label'](), min, marginTop = 10, marginBottom = 5 }: Props = $props();

    const placeholder: string = $state(m['common.password.placeholder']());
</script>

<Input bind:value type="password" {name} {placeholder} {label} {min} {marginBottom} {marginTop} {required} />
