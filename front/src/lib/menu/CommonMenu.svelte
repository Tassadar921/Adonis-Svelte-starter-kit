<script lang="ts">
    import MenuItem from './MenuItem.svelte';
    import { t } from 'svelte-i18n';
    import { profile } from '../../stores/profileStore';
    import Icon from '../shared/Icon.svelte';

    export let footer: boolean = false;
</script>

<ul class={`${footer ? '' : 'space-y-4'} p-4`}>
    {#if $profile}
        <MenuItem {footer} href="/" on:click>
            <Icon name="home" slot="iconLeft" />
            {$t('home.title')}
        </MenuItem>
        <MenuItem {footer} href="/social" on:click>
            <Icon name="people" slot="iconLeft" />
            {$t('social.title')}
        </MenuItem>
        <MenuItem {footer} href="/profile" on:click>
            <Icon name="user" slot="iconLeft" />
            {$t('profile.title')}
        </MenuItem>
        <MenuItem {footer} href="/logout" on:click>
            <Icon name="userRemove" slot="iconLeft" />
            {$t('logout.title')}
        </MenuItem>
        {#if $profile.role === 'admin'}
            <MenuItem {footer} href="/admin" on:click>
                <Icon name="admin" slot="iconLeft" />
                {$t('admin.title')}
            </MenuItem>
        {/if}
    {:else}
        <MenuItem {footer} href="/login" on:click>
            <Icon name="user" slot="iconLeft" />
            {$t('login.title')}
        </MenuItem>
        <MenuItem {footer} href="/create-account" on:click>
            <Icon name="user" slot="iconLeft" />
            {$t('create-account.title')}
        </MenuItem>
    {/if}
</ul>
