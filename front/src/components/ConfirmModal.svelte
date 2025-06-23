<script lang="ts">
    import Modal from '#components/Modal.svelte';
    import { m } from '$lib/paraglide/messages';

    export let showModal: boolean;
    export let closable: boolean = true;
    export let fullWidth: boolean = false;
    export let successText: string = m['common.yes']();
</script>

<Modal bind:showModal {successText} closeText={m['common.no']()} {closable} confirm {fullWidth} on:success on:close>
    <slot name="header" slot="header" />
    <slot />
</Modal>
