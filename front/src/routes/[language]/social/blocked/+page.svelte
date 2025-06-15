<script lang="ts">
    import { profile } from '#stores/profileStore';
    import Forbidden from '#pages/Forbidden.svelte';
    import Blocked from '#pages/Blocked.svelte';
</script>

{#if $profile}
    <Blocked />
{:else}
    <Forbidden />
{/if}
