<script lang="ts">
    import { profile } from '#stores/profileStore';
    import { m } from '$lib/paraglide/messages';
    import { PUBLIC_GITHUB_REPOSITORY } from '$env/static/public';
    import { Github } from '@lucide/svelte';
    import { menuItems } from '#services/menuService';
    import { Link } from '$lib/components/ui/link';
</script>

<footer class="w-full bg-neutral-300 dark:bg-gray-950">
    <div class="grid grid-cols-1 lg:grid-cols-3">
        <div class="px-1">
            <ul class="p-4">
                <Link href={PUBLIC_GITHUB_REPOSITORY} target="_blank" class="flex justify-start items-center">
                    <Github />
                    <p>{m['menu.source-code']()}</p>
                </Link>
            </ul>
        </div>
        <div class="p-1 flex flex-col gap-3 mt-3 items-center bord">
            <h3 class="uppercase font-bold">Navigation</h3>
            <div class="flex flex-col gap-1">
                {#if $profile}
                    {#each menuItems.connected as item (item.title)}
                        {#if !item.href.startsWith('/admin') || $profile.role === 'admin'}
                            <Link href={item.href} class="flex justify-start items-center">
                                <item.icon />
                                <p>{item.title}</p>
                            </Link>
                        {/if}
                    {/each}
                {:else}
                    {#each menuItems.notConnected as item (item.title)}
                        <Link href={item.href} class="flex justify-start items-center">
                            <item.icon />
                            <p>{item.title}</p>
                        </Link>
                    {/each}
                {/if}
            </div>
        </div>
        <div class="px-1">
            <ul class="p-4">
                <li class="p-2">
                    <p class="text-center">© 2025 Tassadraft Studio</p>
                </li>
            </ul>
        </div>
    </div>
</footer>
