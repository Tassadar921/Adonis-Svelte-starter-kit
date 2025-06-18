<script lang="ts">
    import '../app.css';
    import Footer from './Footer.svelte';
    import { location } from '#stores/locationStore';

    let { children } = $props();
    console.log($location);
</script>

<div class="app">
    <main class="flex flex-col bg-gray-200 dark:bg-gray-900 h-screen w-screen px-3.5">
        {@render children()}
    </main>

    <Footer />
</div>
