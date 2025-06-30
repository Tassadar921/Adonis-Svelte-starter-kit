<script lang="ts">
    import * as Sidebar from '$lib/components/ui/sidebar/index.js';
    import { menuItems } from '#services/menuService';
    import { profile } from '#stores/profileStore';
    import Theme from '#components/Theme.svelte';
    import FlagMenu from '#menu/FlagMenu.svelte';
    import { Link } from '$lib/components/ui/link';

    type Props = {
        children: import('svelte').Snippet;
    };

    let { children }: Props = $props();

    let triggerButtonRef: HTMLButtonElement | undefined = $state();
    let isOpen: boolean = $state(false);

    console.log($profile);
</script>

<Sidebar.Provider bind:open={isOpen}>
    <Sidebar.Root toggleButtonRef={triggerButtonRef}>
        <Sidebar.Content>
            <Sidebar.Group>
                <Sidebar.GroupContent>
                    <Sidebar.Menu>
                        <div class="flex items-center gap-5">
                            <Sidebar.Trigger bind:ref={triggerButtonRef} />
                            <FlagMenu />
                            <Theme />
                        </div>
                        <div class="flex flex-col gap-5 mt-3">
                            {#if $profile}
                                {#each menuItems.connected as item (item.title)}
                                    {#if !item.href.startsWith('/admin') || $profile.role === 'admin'}
                                        <Sidebar.MenuItem>
                                            <Link href={item.href} class="flex justify-start items-center gap-3">
                                                <item.icon class="size-6" />
                                                <p class="text-2xl">{item.title}</p>
                                            </Link>
                                        </Sidebar.MenuItem>
                                    {/if}
                                {/each}
                            {:else}
                                {#each menuItems.notConnected as item (item.title)}
                                    <Sidebar.MenuItem>
                                        <Link href={item.href} class="flex justify-start items-center gap-3">
                                            <item.icon class="size-6" />
                                            <p class="text-2xl">{item.title}</p>
                                        </Link>
                                    </Sidebar.MenuItem>
                                {/each}
                            {/if}
                        </div>
                    </Sidebar.Menu>
                </Sidebar.GroupContent>
            </Sidebar.Group>
        </Sidebar.Content>
    </Sidebar.Root>

    <Sidebar.Inset>
        <div class="mt-3">
            <div class="h-10">
                <Sidebar.Trigger class={`${isOpen ? 'hidden' : ''}`} />
            </div>
            {@render children()}
        </div>
    </Sidebar.Inset>
</Sidebar.Provider>
