<script lang="ts">
    import Popover from '#components/Popover.svelte';
    import Icon from '#components/Icon.svelte';

    let { children } = $props();
    let show: boolean = $state(false);
    let iconElement: HTMLButtonElement | null = $state(null);
</script>

<div class="flex items-center justify-center">
    <button
        class="flex items-center justify-center bg-blue-500 text-white rounded-full size-8"
        bind:this={iconElement}
        onmouseover={() => (show = true)}
        onfocus={() => (show = true)}
        onmouseleave={() => (show = false)}
        onblur={() => (show = false)}
    >
        <Icon name="help" />
    </button>

    <Popover {show} target={iconElement}>
        {@render children()}
    </Popover>
</div>
