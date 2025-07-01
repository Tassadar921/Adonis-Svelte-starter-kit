<script lang="ts">
    import { profile } from '#stores/profileStore';
    import { m } from '$lib/paraglide/messages';
    import { PUBLIC_GITHUB_REPOSITORY } from '$env/static/public';
    import { Github } from '@lucide/svelte';
    import { menuItems } from '#services/menuService';
    import { FooterGroupItem } from './';
    import { FooterGroup } from '$lib/components/ui/footer/index.js';
</script>

<footer class="w-full bg-neutral-300 dark:bg-gray-950 py-5 lg:py-10">
    <div class="grid grid-cols-1 lg:grid-cols-3">
        <div class="flex justify-center items-center order-3 lg:order-1">
            <img src="/icons/favicon-96x96.png" alt="logo" class="w-48" />
        </div>
        <FooterGroup title={m['footer.navigation']()} class="order-1 lg:order-2">
            {#if $profile}
                {#each menuItems.connected as item (item.title)}
                    {#if !item.href.startsWith('/admin') || $profile.role === 'admin'}
                        <FooterGroupItem name={item.title} href={item.href} icon={item.icon} />
                    {/if}
                {/each}
            {:else}
                {#each menuItems.notConnected as item (item.title)}
                    <FooterGroupItem name={item.title} href={item.href} icon={item.icon} />
                {/each}
            {/if}
            <p class="text-center">© 2025 Tassadraft Studio</p>
        </FooterGroup>
        <FooterGroup title={m['footer.about']()} class="order-2 lg:order-3">
            <FooterGroupItem name={m['menu.source-code']()} href={PUBLIC_GITHUB_REPOSITORY} icon={Github} />
        </FooterGroup>
    </div>
</footer>
