<script lang="ts">
    import Switch from '#components/Switch.svelte';
    import Icon from '#components/Icon.svelte';
    import { onMount } from 'svelte';

    let checked: boolean = $state(false);

    onMount((): void => {
        checked = localStorage.getItem('theme') === 'dark';
    });

    const handleToggleChange = () => {
        localStorage.setItem('theme', checked ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', checked);
    };
</script>

<div class="flex items-center gap-0.5">
    <span class:dark:text-white={checked} class:text-primary-500={!checked}>
        <Icon name="sun" size={20} />
    </span>
    <Switch size={4} bind:value={checked} on:change={handleToggleChange} />
    <span class:text-primary-500={checked} class:dark:text-white={!checked}>
        <Icon name="moon" size={20} />
    </span>
</div>
