<script lang="ts">
    import { profile } from '#stores/profileStore';
    import Forbidden from '#pages/Forbidden.svelte';
    import Notifications from '#pages/Notifications.svelte';
</script>

{#if $profile}
    <Notifications />
{:else}
    <Forbidden />
{/if}
