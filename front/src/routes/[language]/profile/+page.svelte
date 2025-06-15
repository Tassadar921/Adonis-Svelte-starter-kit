<script lang="ts">
    import { profile } from '#stores/profileStore';
    import Forbidden from '#pages/Forbidden.svelte';
    import Profile from '#pages/Profile.svelte';
</script>

{#if $profile}
    <Profile />
{:else}
    <Forbidden />
{/if}
