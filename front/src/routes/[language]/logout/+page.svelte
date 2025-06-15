<script lang="ts">
    import { profile } from '#stores/profileStore';
    import Forbidden from '#pages/Forbidden.svelte';
    import Logout from '#pages/Logout.svelte';
</script>

{#if $profile}
    <Logout />
{:else}
    <Forbidden />
{/if}
