<script lang="ts">
    import { profile } from '#stores/profileStore';
    import Home from '#pages/Home.svelte';
    import Login from '#pages/Login.svelte';
</script>

{#if $profile}
    <Home />
{:else}
    <Login />
{/if}
