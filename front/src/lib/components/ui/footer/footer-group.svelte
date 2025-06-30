<script lang="ts" module>
    export type FooterGroupProps = {
        children: import('svelte').Snippet;
        title: string;
    };
</script>

<script lang="ts">
    import { Separator } from '$lib/components/ui/separator';

    let { children, title }: FooterGroupProps = $props();
</script>

<div class="p-1 flex flex-col gap-3 mt-3 items-center">
    <h3 class="uppercase font-bold">{title}</h3>
    <Separator />
    <ul class="flex flex-col gap-1">
        {@render children()}
    </ul>
</div>
