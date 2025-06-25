<script lang="ts">
    import { onMount } from 'svelte';
    import CalendarIcon from '@lucide/svelte/icons/calendar';
    import HouseIcon from '@lucide/svelte/icons/house';
    import InboxIcon from '@lucide/svelte/icons/inbox';
    import SearchIcon from '@lucide/svelte/icons/search';
    import SettingsIcon from '@lucide/svelte/icons/settings';
    import * as Sidebar from '$lib/components/ui/sidebar/index.js';
    import { menuItems } from '#services/menuService';
    import { profile } from '#stores/profileStore';

    let triggerButtonRef: HTMLButtonElement | undefined = $state();
</script>

<Sidebar.Provider open={false}>
    <Sidebar.Root toggleButtonRef={triggerButtonRef}>
        <Sidebar.Content>
            <Sidebar.Group>
                <Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
                <Sidebar.GroupContent>
                    <Sidebar.Menu>
                        {#if $profile}
                            {#each menuItems.connected as item (item.title)}
                                <Sidebar.MenuItem>
                                    <Sidebar.MenuButton>
                                        {#snippet child({ props })}
                                            <a href={item.href} {...props}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        {/snippet}
                                    </Sidebar.MenuButton>
                                </Sidebar.MenuItem>
                            {/each}
                        {:else}
                            {#each menuItems.notConnected as item (item.title)}
                                <Sidebar.MenuItem>
                                    <Sidebar.MenuButton>
                                        {#snippet child({ props })}
                                            <a href={item.href} {...props}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        {/snippet}
                                    </Sidebar.MenuButton>
                                </Sidebar.MenuItem>
                            {/each}
                        {/if}
                    </Sidebar.Menu>
                </Sidebar.GroupContent>
            </Sidebar.Group>
        </Sidebar.Content>
    </Sidebar.Root>

    <Sidebar.Trigger bind:ref={triggerButtonRef} />
</Sidebar.Provider>
