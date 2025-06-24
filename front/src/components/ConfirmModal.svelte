<script lang="ts">
    import Modal from '#components/Modal.svelte';
    import { m } from '$lib/paraglide/messages';

    type Props = {
        children: () => any;
        header: () => any;
        showModal: boolean;
        closable: boolean;
        fullWidth?: boolean;
        successText?: string;
    };

    let { children, header, showModal, closable, fullWidth = false, successText = m['common.yes']() }: Props = $props();
</script>

<Modal bind:showModal {successText} closeText={m['common.no']()} {closable} confirm {fullWidth} on:success on:close>
    {#snippet header()}
        {@render header()}
    {/snippet}
    {@render children()}
</Modal>
