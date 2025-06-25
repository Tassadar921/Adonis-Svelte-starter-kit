<script lang="ts">
    import Footer from '../Footer.svelte';

    let { children } = $props();
</script>

<div class="h-screen px-3.5">
    {@render children()}
</div>

<Footer />
