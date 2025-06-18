<script lang="ts">
    import MenuItem from './MenuItem.svelte';
    import Icon from '#components/Icon.svelte';
    import { m } from '$lib/paraglide/messages.js';
</script>

<MenuItem href="/admin/dashboard" on:click>
    <Icon name="home" slot="iconLeft" />
    {m['admin.dashboard.title']()}
</MenuItem>

<MenuItem href="/admin/users" on:click>
    <Icon name="user" slot="iconLeft" />
    {m['admin.users.title']()}
</MenuItem>
