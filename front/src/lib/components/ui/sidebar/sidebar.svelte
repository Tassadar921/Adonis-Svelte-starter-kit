<script lang="ts">
    import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '#lib/components/ui/sheet';
    import { cn, type WithElementRef } from '#lib/utils';
    import type { HTMLAttributes } from 'svelte/elements';
    import { SIDEBAR_WIDTH_MOBILE } from './constants';
    import { useSidebar } from './context.svelte';
    import { onMount, tick } from 'svelte';

    let {
        ref = $bindable(null),
        toggleButtonRef = $bindable(),
        side = 'left',
        variant = 'sidebar',
        collapsible = 'offcanvas',
        class: className,
        children,
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
        toggleButtonRef: HTMLButtonElement | undefined;
        side?: 'left' | 'right';
        variant?: 'sidebar' | 'floating' | 'inset';
        collapsible?: 'offcanvas' | 'icon' | 'none';
    } = $props();

    const sidebar = useSidebar();
    let containerRef: HTMLElement | undefined = $state();

    const handleClick = async (event: MouseEvent) => {
        await tick();

        if (sidebar.shouldIgnoreNextOutsideClick()) return;

        const target = event.target as Node;

        if (!containerRef?.contains(target) && !toggleButtonRef?.contains(target)) {
            if (!sidebar.isMobile && sidebar.state === 'expanded') {
                sidebar.setOpen(false);
            }
            if (sidebar.isMobile && sidebar.openMobile) {
                sidebar.setOpenMobile(false);
            }
        }
    };

    onMount(() => {
        document.addEventListener('click', handleClick, true);

        return () => {
            document.removeEventListener('click', handleClick, true);
        };
    });
</script>

{#if collapsible === 'none'}
    <div class={cn('bg-sidebar text-sidebar-foreground w-(--sidebar-width) flex h-full flex-col', className)} bind:this={ref} {...restProps}>
        {@render children?.()}
    </div>
{:else if sidebar.isMobile}
    <Sheet bind:open={() => sidebar.openMobile, (v) => sidebar.setOpenMobile(v)} {...restProps}>
        <SheetContent
            data-sidebar="sidebar"
            data-slot="sidebar"
            data-mobile="true"
            class="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
            style="--sidebar-width: {SIDEBAR_WIDTH_MOBILE};"
            {side}
        >
            <SheetHeader class="sr-only">
                <SheetTitle>Sidebar</SheetTitle>
                <SheetDescription>Displays the mobile sidebar.</SheetDescription>
            </SheetHeader>
            <div class="flex h-full w-full flex-col">
                {@render children?.()}
            </div>
        </SheetContent>
    </Sheet>
{:else}
    <div
        bind:this={ref}
        class="text-sidebar-foreground group peer hidden md:block"
        data-state={sidebar.state}
        data-collapsible={sidebar.state === 'collapsed' ? collapsible : ''}
        data-variant={variant}
        data-side={side}
        data-slot="sidebar"
    >
        <!-- This is what handles the sidebar gap on desktop -->
        <div
            data-slot="sidebar-gap"
            class={cn(
                'w-(--sidebar-width) relative bg-transparent transition-[width] duration-200 ease-linear',
                'group-data-[collapsible=offcanvas]:w-0',
                'group-data-[side=right]:rotate-180',
                variant === 'floating' || variant === 'inset'
                    ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
                    : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)'
            )}
        ></div>
        <div
            bind:this={containerRef}
            data-slot="sidebar-container"
            class={cn(
                'w-(--sidebar-width) fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] duration-200 ease-linear md:flex',
                side === 'left' ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]' : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
                // Adjust the padding for floating and inset variants.
                variant === 'floating' || variant === 'inset'
                    ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
                    : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
                className
            )}
            {...restProps}
        >
            <div
                data-sidebar="sidebar"
                data-slot="sidebar-inner"
                class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
            >
                {@render children?.()}
            </div>
        </div>
    </div>
{/if}
