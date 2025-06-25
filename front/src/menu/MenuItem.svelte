<script lang="ts">
    import { location } from '#stores/locationStore';
    import Link from '#components/Link.svelte';
    import Icon from '#components/Icon.svelte';

    type Props = {
        children: import('svelte').Snippet;
        iconLeft: import('svelte').Snippet;
        href: string;
        target?: string;
    };

    let { children, iconLeft, href = '', target = '' }: Props = $props();

    let clickable: boolean = $state(false);

    $effect((): void => {
        clickable = href !== $location;
    });
</script>

<Link
    href={clickable ? href : undefined}
    className={`${!clickable ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-400'} px-2 flex justify-center items-center transition-colors duration-300 rounded ${clickable ? 'cursor-pointer dark:hover:bg-gray-700' : ''}`}
    {target}
>
    <div class="text-primary-500">
        {@render iconLeft?.()}
    </div>
    <span class="text-black dark:text-white text-nowrap p-2">
        {@render children()}
    </span>
    <div class="dark:text-white">
        <Icon name="chevronRight" />
    </div>
</Link>
