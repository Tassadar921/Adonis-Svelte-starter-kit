<script lang="ts">
    import Icon from '#components/Icon.svelte';
    import { Popover, PopoverContent, PopoverTrigger } from '#lib/components/ui/popover';

    type Props = {
        children: import('svelte').Snippet;
    };

    let { children }: Props = $props();

    let isOpen: boolean = $state(false);
</script>

<Popover bind:open={isOpen}>
    <PopoverTrigger class="w-8 p-1">
        <Icon name="help" />
    </PopoverTrigger>
    <PopoverContent>
        {@render children()}
    </PopoverContent>
</Popover>
