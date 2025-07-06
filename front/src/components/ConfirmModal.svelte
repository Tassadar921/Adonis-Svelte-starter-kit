<script lang="ts">
    import Modal from '#components/Modal.svelte';
    import { m } from '#lib/paraglide/messages';

    type Props = {
        children: import('svelte').Snippet;
        onopen: () => void;
        onsuccess: () => void;
        onclose: () => void;
        showModal: boolean;
        closable: boolean;
        fullWidth?: boolean;
        successText?: string;
    };

    let { children, onopen, onsuccess, onclose, showModal = $bindable(), closable = true, fullWidth = false, successText = m['common.yes']() }: Props = $props();
</script>

<Modal bind:showModal {successText} closeText={m['common.no']()} {closable} confirm {fullWidth} {onopen} {onsuccess} {onclose}>
    {#snippet header()}
        {@render header()}
    {/snippet}
    {@render children()}
</Modal>
