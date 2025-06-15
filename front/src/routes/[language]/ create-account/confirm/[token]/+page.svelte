<script lang="ts">
    import { profile } from '#stores/profileStore';
    import AlreadyConnected from "#pages/AlreadyConnected.svelte";
    import CreateAccount from "#pages/CreateAccount.svelte";
</script>

{#if $profile}
    <AlreadyConnected />
{:else}
    <CreateAccount />
{/if}
