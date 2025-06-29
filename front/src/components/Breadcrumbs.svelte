<script lang="ts">
    import { Link } from '$lib/components/ui/link';

    interface Breadcrumb {
        label: string;
        path?: string;
    }

    type Props = {
        items: Breadcrumb[];
    };

    let { items }: Props = $props();
</script>

<div class="relative flex gap-3 z-10">
    {#each items as item, index}
        {#if items.length - 1 !== index}
            <Link href={item.path ?? '#'} class="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-500 duration-300 transition-colors">
                <span>{item.label}</span>
            </Link>
            <!--            <span class:text-white={hasBackground} class="dark:text-white">></span>-->
            <p>></p>
        {:else}
            <!--			<span class:text-white={hasBackground} class="dark:text-white">{item.label}</span>-->
            <span class="dark:text-white">{item.label}</span>
        {/if}
    {/each}
</div>
