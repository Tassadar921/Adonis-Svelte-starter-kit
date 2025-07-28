<script lang="ts">
    import '../app.css';
    import Menu from '#partials/menu/Menu.svelte';
    import { onMount } from 'svelte';
    import Meta from '#components/Meta.svelte';
    import { m } from '#lib/paraglide/messages';
    import { initFlash } from 'sveltekit-flash-message/client';
    import { page as currentPage } from '$app/state';
    import { readable } from 'svelte/store';
    import { showToast } from '#services/toastService';
    import { Footer } from '#lib/components/ui/footer';
    import { Transmit } from '@adonisjs/transmit-client';
    import { transmit } from '#stores/transmitStore';
    import { PUBLIC_API_REAL_URI } from '$env/static/public';

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
    });

    $effect((): void => {
        transmit.set(new Transmit({ baseUrl: PUBLIC_API_REAL_URI }));
        if ($flash) {
            showToast($flash.message, $flash.type);
        }
    });
</script>

<Meta title={m['home.meta.title']()} description={m['home.meta.description']()} keywords={m['home.meta.keywords']().split(', ')} />

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
