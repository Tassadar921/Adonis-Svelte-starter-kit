<script lang="ts">
    import MenuItem from '#menu/MenuItem.svelte';
    import CommonMenu from '#menu/CommonMenu.svelte';
    import { m } from '$lib/paraglide/messages';
    import Icon from '#components/Icon.svelte';
    import { PUBLIC_GITHUB_REPOSITORY } from '$env/static/public';
</script>

<footer class="w-full bg-gray-300 dark:bg-gray-950 p-5 pb-10">
    <div class="grid grid-cols-1 lg:grid-cols-3">
        <div class="px-1">
            <ul class="p-4">
                <MenuItem target="_blank" footer href={PUBLIC_GITHUB_REPOSITORY}>
                    <Icon name="openSource" slot="iconLeft" />
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
