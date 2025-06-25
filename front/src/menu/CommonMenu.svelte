<script lang="ts">
    import MenuItem from './MenuItem.svelte';
    import { m } from '$lib/paraglide/messages';
    import { profile } from '#stores/profileStore';
    import Icon from '#components/Icon.svelte';
</script>

<ul class="p-4">
    {#if $profile}
        <MenuItem href="/" on:click>
            {#snippet iconLeft()}
                <Icon name="home" />
            {/snippet}
            {m['home.title']()}
        </MenuItem>
        <MenuItem href="/social" on:click>
            {#snippet iconLeft()}
                <Icon name="home" />
            {/snippet}
            {m['social.title']()}
        </MenuItem>
        <MenuItem href="/profile" on:click>
            {#snippet iconLeft()}
                <Icon name="user" />
            {/snippet}
            {m['profile.title']()}
        </MenuItem>
        <MenuItem href="/logout" on:click>
            {#snippet iconLeft()}
                <Icon name="userRemove" />
            {/snippet}
            {m['logout.title']()}
        </MenuItem>
        {#if $profile.role === 'admin'}
            <MenuItem href="/admin" on:click>
                {#snippet iconLeft()}
                    <Icon name="admin" />
                {/snippet}
                {m['admin.title']()}
            </MenuItem>
        {/if}
    {:else}
        <MenuItem href="/login" on:click>
            {#snippet iconLeft()}
                <Icon name="user" />
            {/snippet}
            {m['login.title']()}
        </MenuItem>
        <MenuItem href="/create-account" on:click>
            {#snippet iconLeft()}
                <Icon name="user" />
            {/snippet}
            {m['create-account.title']()}
        </MenuItem>
    {/if}
</ul>
