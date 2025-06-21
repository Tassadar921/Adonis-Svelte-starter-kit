<script lang="ts">
    import '../app.css';
    import Footer from './Footer.svelte';
    import Menu from '#menu/Menu.svelte';
    import { onMount } from 'svelte';

    let { children } = $props();

    onMount((): void => {
        const theme: string | null = localStorage.getItem('theme');
        document.documentElement.classList.toggle('dark', theme === 'dark');
        if (theme !== 'light' && theme !== 'dark') {
            localStorage.setItem('theme', 'light');
        }
    });
</script>

<div class="app">
    <main class="flex flex-col h-screen w-screen">
        <Menu />
        {@render children()}
    </main>

    <Footer />
</div>
