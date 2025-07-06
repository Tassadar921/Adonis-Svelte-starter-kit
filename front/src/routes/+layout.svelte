<script lang="ts">
    import '../app.css';
    import Menu from '#menu/Menu.svelte';
    import { onMount } from 'svelte';
    import Meta from '#components/Meta.svelte';
    import { m } from '#lib/paraglide/messages';
    import NotificationsSetup from './NotificationsSetup.svelte';
    import { initFlash } from 'sveltekit-flash-message/client';
    import { page as currentPage } from '$app/state';
    import { readable } from 'svelte/store';
    import { showToast } from '#services/toastService';
    import { Footer } from '#lib/components/ui/footer';

    const page = readable(currentPage);

    interface Props {
        children: import('svelte').Snippet;
    }

    let { children }: Props = $props();

    const flash = initFlash(page);

    onMount((): void => {
        const theme: string | null = localStorage.getItem('theme');
        document.documentElement.classList.toggle('dark', theme === 'dark');
        if (theme !== 'light' && theme !== 'dark') {
            localStorage.setItem('theme', 'light');
        }

        if ($flash) {
            showToast($flash.message, $flash.type);
        }
    });
</script>

<Meta title={m['home.meta.title']()} description={m['home.meta.description']()} keywords={m['home.meta.keywords']().split(', ')} />

<!--<NotificationsSetup />-->

<div class="app">
    <main class="flex flex-col w-screen">
        <Menu>
            <div class="min-h-screen px-3.5">
                {@render children()}
            </div>

            <Footer />
        </Menu>
    </main>
</div>
