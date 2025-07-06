<script lang="ts">
    import { Link } from '#lib/components/ui/link';
    import type { Component } from 'svelte';

    type Props = {
        title: string;
        icon: Component;
        href: string;
        description: string;
    };

    let { title, icon: Icon, href, description }: Props = $props();

    let hovering = $state(false);
</script>

<Link
    {href}
    onmouseover={() => (hovering = true)}
    onmouseout={() => (hovering = false)}
    class="flex flex-col gap-5 md:flex-row items-center p-6 rounded-lg shadow-lg bg-gray-300 dark:bg-gray-700 h-40"
>
    <div class:opacity-70={description && hovering} class="flex flex-col gap-5 items-center justify-center text-center transition-opacity duration-300">
        <p class="text-3xl">{title}</p>
        <Icon class="size-10" />
    </div>
    <p
        class:opacity-0={!description || !hovering}
        class="flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-300 transition-opacity duration-300 whitespace-normal text-xl"
    >
        {description}
    </p>
</Link>
