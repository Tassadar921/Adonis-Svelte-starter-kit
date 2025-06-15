<script lang="ts">
    import { profile } from '#stores/profileStore';
    import Social from '#pages/Social.svelte';
    import Forbidden from '#pages/Forbidden.svelte';
</script>

{#if $profile}
    <Social />
{:else}
    <Forbidden />
{/if}
