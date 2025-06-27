<script lang="ts">
    import * as Sidebar from '$lib/components/ui/sidebar/index.js';
    import { menuItems } from '#services/menuService';
    import { profile } from '#stores/profileStore';
    import { Button } from '$lib/components/ui/button';
    import Theme from '#components/Theme.svelte';
    import FlagMenu from '#menu/FlagMenu.svelte';

    type Props = {
        children: import('svelte').Snippet;
    };

    let { children }: Props = $props();

    let triggerButtonRef: HTMLButtonElement | undefined = $state();
    let isOpen: boolean = $state(false);
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
                        {#if $profile}
                            {#each menuItems.connected as item (item.title)}
                                <div class="mt-3">
                                    <Sidebar.MenuItem>
                                        <Button href={item.href} variant="link" class="flex justify-start items-center">
                                            <item.icon classname="size-8" />
                                            <p class="text-xl">{item.title}</p>
                                        </Button>
                                    </Sidebar.MenuItem>
                                </div>
                            {/each}
                        {:else}
                            {#each menuItems.notConnected as item (item.title)}
                                <div class="mt-3">
                                    <Sidebar.MenuItem>
                                        <Button href={item.href} variant="link" class="flex justify-start items-center">
                                            <item.icon classname="size-8" />
                                            <p class="text-xl">{item.title}</p>
                                        </Button>
                                    </Sidebar.MenuItem>
                                </div>
                            {/each}
                        {/if}
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
