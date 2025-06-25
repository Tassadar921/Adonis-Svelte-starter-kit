<script lang="ts">
    import MenuItem from '#menu/MenuItem.svelte';
    import CommonMenu from '#menu/CommonMenu.svelte';
    import { m } from '$lib/paraglide/messages';
    import { PUBLIC_GITHUB_REPOSITORY } from '$env/static/public';
    import { Github } from '@lucide/svelte';
</script>

<footer class="w-full bg-gray-400 dark:bg-gray-950 p-5 pb-10">
    <div class="grid grid-cols-1 lg:grid-cols-3">
        <div class="px-1">
            <ul class="p-4">
                <MenuItem target="_blank" href={PUBLIC_GITHUB_REPOSITORY}>
                    {#snippet iconLeft()}
                        <Github />
                    {/snippet}
                    {m['menu.source-code']()}
                </MenuItem>
            </ul>
        </div>
        <div class="px-1">
            <CommonMenu />
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
