<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import Switch from './Switch.svelte';
    import Icon from './Icon.svelte';

    export let title: string = '';

    let checked = false;
    let mounted = false;

    const iconSize: number = 20;
    const switchSize: number = 4;

    onMount(() => {
        if (browser) {
            mounted = true;
            checked = localStorage.getItem('theme') === 'dark';
            // Appliquer le thème au chargement
            document.documentElement.classList.toggle('dark', checked);
        }
    });

    const handleToggleChange = () => {
        if (!browser) return;

        localStorage.setItem('theme', checked ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', checked);
    };
</script>

{#if !browser || mounted}
    {#if title}
        <div class="legend font-bold mb-2">
            <p>{title}</p>
        </div>
    {/if}

    <div class="flex flex-row items-center gap-0.5">
        <span class={checked ? 'dark:text-white' : 'text-primary-500'}>
            <Icon name="sun" size={iconSize} />
        </span>
        <Switch size={switchSize} bind:value={checked} on:change={handleToggleChange} />
        <span class={checked ? 'text-primary-500' : 'dark:text-white'}>
            <Icon name="moon" size={iconSize} />
        </span>
    </div>
{/if}
