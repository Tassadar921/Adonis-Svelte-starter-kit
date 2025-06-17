<script lang="ts">
    import MenuItem from './MenuItem.svelte';
    import Icon from '#components/Icon.svelte';
    import { t } from 'svelte-i18n';
</script>

<MenuItem href="/admin/dashboard" on:click>
    <Icon name="home" slot="iconLeft" />
    {$t('admin.dashboard.title')}
</MenuItem>

<MenuItem href="/admin/users" on:click>
    <Icon name="user" slot="iconLeft" />
    {$t('admin.users.title')}
</MenuItem>
