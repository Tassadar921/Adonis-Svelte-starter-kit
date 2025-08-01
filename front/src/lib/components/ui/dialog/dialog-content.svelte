<script lang="ts">
    import { Dialog as DialogPrimitive } from 'bits-ui';
    import type { Snippet } from 'svelte';
    import { DialogPortal, DialogOverlay } from './index.js';
    import { cn, type WithoutChildrenOrChild } from '#lib/utils.js';
    import { XIcon } from '@lucide/svelte';

    let {
        ref = $bindable(null),
        class: className,
        portalProps,
        children,
        showCloseButton = true,
        ...restProps
    }: WithoutChildrenOrChild<DialogPrimitive.ContentProps> & {
        portalProps?: DialogPrimitive.PortalProps;
        children: Snippet;
        showCloseButton?: boolean;
    } = $props();
</script>

<DialogPortal {...portalProps}>
    <DialogOverlay />
    <DialogPrimitive.Content
        bind:ref
        data-slot="dialog-content"
        class={cn(
            'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed left-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
            className
        )}
        {...restProps}
    >
        {@render children?.()}
        {#if showCloseButton}
            <DialogPrimitive.Close
                class="cursor-pointer ring-offset-background focus:ring-ring rounded-xs focus:outline-hidden absolute right-4 top-4 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0"
            >
                <XIcon />
                <span class="sr-only">Close</span>
            </DialogPrimitive.Close>
        {/if}
    </DialogPrimitive.Content>
</DialogPortal>
