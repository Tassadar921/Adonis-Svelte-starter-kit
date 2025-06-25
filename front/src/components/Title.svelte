<script lang="ts">
    interface Props {
        title: string;
        hasBackground?: boolean;
    }

    let { title, hasBackground = false }: Props = $props();
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<h1 class:dark:text-white={hasBackground} class="relative z-10 text-3xl font-bold mb-2">{title}</h1>
