<script lang="ts">
    import * as Sidebar from '$lib/components/ui/sidebar/index.js';
    import { menuItems } from '#services/menuService';
    import { profile } from '#stores/profileStore';
    import { Button } from '$lib/components/ui/button';
    import Theme from '#components/Theme.svelte';

    type Props = {
        children: import('svelte').Snippet;
    };

    let { children }: Props = $props();

    let triggerButtonRef: HTMLButtonElement | undefined = $state();
</script>

<Sidebar.Provider open={false}>
    <Sidebar.Root toggleButtonRef={triggerButtonRef}>
        <Sidebar.Content>
            <Sidebar.Group>
                <Sidebar.GroupContent>
                    <Sidebar.Menu>
                        <div class="flex gap-3">
                            <Theme />
                        </div>
                        {#if $profile}
                            {#each menuItems.connected as item (item.title)}
                                <Sidebar.MenuItem>
                                    <Sidebar.MenuButton>
                                        {#snippet child({ props })}
                                            <Button href={item.href} variant="link">
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Button>
                                        {/snippet}
                                    </Sidebar.MenuButton>
                                </Sidebar.MenuItem>
                            {/each}
                        {:else}
                            {#each menuItems.notConnected as item (item.title)}
                                <div class="mt-3">
                                    <Sidebar.MenuItem>
                                        <Sidebar.MenuButton>
                                            {#snippet child({ props })}
                                                <Button variant="link" class="flex justify-start items-center" href={item.href} {...props}>
                                                    <item.icon classname="size-8" />
                                                    <p class="text-xl">{item.title}</p>
                                                </Button>
                                            {/snippet}
                                        </Sidebar.MenuButton>
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
            <Sidebar.Trigger class="ml-2" bind:ref={triggerButtonRef} />
            {@render children()}
        </div>
    </Sidebar.Inset>
</Sidebar.Provider>
