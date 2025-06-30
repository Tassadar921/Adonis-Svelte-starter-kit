<script lang="ts">
    import { Footer } from '$lib/components/ui/footer';

    let { children } = $props();
</script>

<div class="min-h-screen px-3.5">
    {@render children()}
</div>

<Footer />
