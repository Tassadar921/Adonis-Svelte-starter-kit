<script lang="ts">
    import { profile } from '#stores/profileStore';
    import AlreadyConnected from '#pages/AlreadyConnected.svelte';
    import ConfirmAccountCreation from '#pages/ConfirmAccountCreation.svelte';

    export let token: string;
</script>

{#if $profile}
    <AlreadyConnected />
{:else}
    <ConfirmAccountCreation {token} />
{/if}
