<script lang="ts">
    import { profile } from '#stores/profileStore';
    import AlreadyConnected from '#pages/AlreadyConnected.svelte';
    import Oauth from '#pages/Oauth.svelte';

    export let apiToken: string;
</script>

{#if $profile}
    <AlreadyConnected />
{:else}
    <Oauth {apiToken} />
{/if}
