<script lang="ts">
    import Button from '#components/Button.svelte';
    import { createEventDispatcher, onMount } from 'svelte';
    import { m } from '$lib/paraglide/messages';

    const dispatch = createEventDispatcher();

    type Props = {
        children: () => any;
        header: () => any;
        showModal: boolean;
        closeText: string | null;
        successText: string;
        fullWidth: boolean;
        confirm: boolean;
        closable: boolean;
    };

    let { children, header, showModal = false, closeText = null, successText = '', fullWidth = false, confirm = false, closable = true }: Props = $props();

    let initialFullWidth: boolean = fullWidth;
    let dialog: HTMLDialogElement;

    const handleSuccess = () => dispatch('success');

    const handleCancel = (event: Event) => {
        event.preventDefault();
        if (!closable) {
            requestAnimationFrame(() => dialog.showModal());
            return;
        }
        handleClose();
    };

    const handleClose = () => {
        if (closable) {
            dispatch('close');
            dialog.close();
        }
    };

    onMount(() => {
        if (!initialFullWidth) {
            window.addEventListener('resize', () => {
                fullWidth = window.innerWidth < 768;
            });
        }
    });

    $effect(() => {
        if (dialog) {
            showModal ? (dialog.showModal(), dispatch('open')) : dialog.close();
        }
    });
</script>

<dialog
    bind:this={dialog}
    onclose={() => (showModal = false)}
    oncancel={handleCancel}
    class="fixed inset-0 z-50 flex items-center justify-center backdrop:bg-black/50 open:animate-[zoom_0.3s_cubic-bezier(0.34,1.56,0.64,1)]"
>
    <div class={`relative bg-white dark:bg-gray-700 rounded-lg p-4 ${fullWidth ? 'w-[90%]' : 'w-1/2'}`}>
        {#if closable}
            <Button ariaLabel={m['common.close-modal']()} className="fixed inset-0 w-full h-full cursor-default" customStyle on:click={handleClose} />
        {/if}

        {@render header?.()}
        <hr class="my-2" />
        {@render children?.()}
        <hr class="my-2" />

        <div class="flex justify-center">
            {#if successText}
                <div class="flex justify-center w-full space-x-12">
                    {#if !confirm && closable}
                        <Button on:click={handleClose} ariaLabel={closeText || m['common.no']()}>
                            {closeText || m['common.no']()}
                        </Button>
                    {/if}
                    <Button on:click={handleSuccess} ariaLabel={successText || m['common.yes']()}>
                        {successText || m['common.yes']()}
                    </Button>
                    {#if confirm && closable}
                        <Button on:click={handleClose} ariaLabel={closeText || m['common.no']()}>
                            {closeText || m['common.no']()}
                        </Button>
                    {/if}
                </div>
            {:else if closable}
                <Button on:click={handleClose} ariaLabel={m['common.close']()}>
                    {closeText || m['common.close']()}
                </Button>
            {/if}
        </div>
    </div>
</dialog>

<style>
    @keyframes zoom {
        from {
            transform: scale(0.95);
        }
        to {
            transform: scale(1);
        }
    }
</style>
