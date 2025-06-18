<script lang="ts">
    import MenuItem from './MenuItem.svelte';
    import { m } from '$lib/paraglide/messages.js';
    import { profile } from '#stores/profileStore';
    import Icon from '#components/Icon.svelte';

    export let footer: boolean = false;
</script>

<ul class={`${footer ? '' : 'space-y-4'} p-4`}>
    {#if $profile}
        <MenuItem {footer} href="/" on:click>
            <Icon name="home" slot="iconLeft" />
            {m['home.title']()}
        </MenuItem>
        <MenuItem {footer} href="/social" on:click>
            <Icon name="people" slot="iconLeft" />
            {m['social.title']()}
        </MenuItem>
        <MenuItem {footer} href="/profile" on:click>
            <Icon name="user" slot="iconLeft" />
            {m['profile.title']()}
        </MenuItem>
        <MenuItem {footer} href="/logout" on:click>
            <Icon name="userRemove" slot="iconLeft" />
            {m['logout.title']()}
        </MenuItem>
        {#if $profile.role === 'admin'}
            <MenuItem {footer} href="/admin" on:click>
                <Icon name="admin" slot="iconLeft" />
                {m['admin.title']()}
            </MenuItem>
        {/if}
    {:else}
        <MenuItem {footer} href="/login" on:click>
            <Icon name="user" slot="iconLeft" />
            {m['login.title']()}
        </MenuItem>
        <MenuItem {footer} href="/create-account" on:click>
            <Icon name="user" slot="iconLeft" />
            {m['create-account.title']()}
        </MenuItem>
    {/if}
</ul>
