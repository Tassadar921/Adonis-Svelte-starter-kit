<script lang="ts">
    import { profile } from '#stores/profileStore';
    import Forbidden from '#pages/Forbidden.svelte';
    import Friends from '#pages/Friends.svelte';
</script>

{#if $profile}
    <Friends />
{:else}
    <Forbidden />
{/if}
