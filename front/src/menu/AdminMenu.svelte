<script lang="ts">
    import MenuItem from './MenuItem.svelte';
    import Icon from '#components/Icon.svelte';
    import { m } from '$lib/paraglide/messages';
</script>

<MenuItem href="/admin/dashboard" on:click>
    {#snippet iconLeft()}
        <Icon name="home" />
    {/snippet}
    {m['admin.dashboard.title']()}
</MenuItem>

<MenuItem href="/admin/users" on:click>
    {#snippet iconLeft()}
        <Icon name="user" />
    {/snippet}
    {m['admin.users.title']()}
</MenuItem>
