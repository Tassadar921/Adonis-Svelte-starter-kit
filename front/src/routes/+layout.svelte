<script lang="ts">
    import '../app.css';
    import Footer from "./Footer.svelte";

    let { children } = $props();
</script>

<div class="app">
    <main class="flex flex-col bg-gray-200 dark:bg-gray-900 h-screen w-screen">
        {@render children()}
    </main>

    <Footer />
</div>
