<script lang="ts">
    import { location } from '#stores/locationStore';
    import Link from '#components/Link.svelte';
    import Icon from '#components/Icon.svelte';

    type Props = {
        children: () => any;
        iconLeft: () => any;
        href: string;
        footer: boolean;
        target?: string;
    };

    let { children, iconLeft, href = '', footer = false, target = '' }: Props = $props();

    let clickable: boolean = $state(false);

    $effect((): void => {
        clickable = href !== $location;
    });
</script>

<Link
    href={clickable ? href : undefined}
    className={`${!clickable ? 'cursor-not-allowed opacity-50' : footer ? 'hover:bg-gray-400' : 'hover:bg-gray-600'} px-2 flex justify-center items-center transition-colors duration-300 rounded ${clickable ? 'cursor-pointer dark:hover:bg-gray-700' : ''}`}
    {target}
    on:click
>
    <div class="text-primary-500">
        {@render iconLeft?.()}
    </div>
    <span class="{footer ? 'text-black dark:text-white' : 'text-white text-xl'} text-nowrap p-2">
        {@render children()}
    </span>
    <div class="dark:text-white">
        <Icon name="chevronRight" />
    </div>
</Link>
