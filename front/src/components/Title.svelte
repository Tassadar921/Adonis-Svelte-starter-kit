<script lang="ts">
    import { onMount } from 'svelte';

    export let title: string;
    export let hasBackground: boolean = false;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<h1 class="relative z-10 text-3xl {hasBackground ? 'text-white' : ''} font-bold mb-2">{title}</h1>
