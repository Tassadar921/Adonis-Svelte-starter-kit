<script lang="ts">
    import { Button } from '#lib/components/ui/button';
    import { ArrowUpDown } from '@lucide/svelte';

    type Props = {
        title: string;
    };

    const { title }: Props = $props();

    let hovered: boolean = $state(false);
</script>

<Button variant={hovered ? 'outline' : 'ghost'} class="border border-transparent flex items-center gap-1" onmouseenter={() => (hovered = true)} onmouseleave={() => (hovered = false)}>
    <p>{title}</p>
    <ArrowUpDown class="size-4" />
</Button>
