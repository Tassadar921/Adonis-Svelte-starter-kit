<script lang="ts">
    type Props = {
        children: () => any;
        show: boolean;
        target: HTMLElement;
    };

    let { children, show = false, target }: Props = $props();

    let x: number = $state(0);
    let y: number = $state(0);
    let popover: HTMLElement | undefined = $state();
    let popoverHeight: number = $state(0);

    $effect((): void => {
        if (popover) {
            popoverHeight = popover.offsetHeight || 0;
        }
    });

    $effect((): void => {
        if (target && show) {
            const { left, top, width, height } = target.getBoundingClientRect();
            const viewportHeight: number = window.innerHeight;

            const bottomY: number = top + height + 10;
            const isOffscreen: boolean = bottomY + popoverHeight > viewportHeight;

            x = left + width / 2;
            y = isOffscreen ? top - popoverHeight - 10 : bottomY;
        }
    });
</script>

{#if show}
    <div bind:this={popover} class="fixed left-[{x}px] top-[{y}px] text-center text-primary-500 bg-white border border-gray-300 p-2 rounded-md shadow-md z-50" style="transform: translate(-50%, 0);">
        {@render children?.()}
    </div>
{/if}
