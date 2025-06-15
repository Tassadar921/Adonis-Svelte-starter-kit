<script lang="ts">
    import { profile } from '#stores/profileStore';
    import AlreadyConnected from '#pages/AlreadyConnected.svelte';
    import Login from '#pages/Login.svelte';
</script>

{#if $profile}
    <AlreadyConnected />
{:else}
    <Login />
{/if}
