<script lang="ts">
    import Icon from '#components/Icon.svelte';
    import * as Popover from '$lib/components/ui/popover';

    type Props = {
        children: import('svelte').Snippet;
    };

    let { children }: Props = $props();

    let isOpen: boolean = $state(false);
</script>

<Popover.Root bind:open={isOpen}>
    <Popover.Trigger class="w-8 p-1">
        <Icon name="help" />
    </Popover.Trigger>
    <Popover.Content>
        {@render children()}
    </Popover.Content>
</Popover.Root>
