<script lang="ts">
    import '../app.css';
    import Menu from '#menu/Menu.svelte';
    import { onMount } from 'svelte';
    import Meta from '#components/Meta.svelte';
    import { m } from '$lib/paraglide/messages';
    import NotificationsSetup from './NotificationsSetup.svelte';

    interface Props {
        children: import('svelte').Snippet;
    }

    let { children }: Props = $props();

    onMount((): void => {
        const theme: string | null = localStorage.getItem('theme');
        document.documentElement.classList.toggle('dark', theme === 'dark');
        if (theme !== 'light' && theme !== 'dark') {
            localStorage.setItem('theme', 'light');
        }
    });
</script>

<Meta title={m['home.meta.title']()} description={m['home.meta.description']()} keywords={m['home.meta.keywords']().split(', ')} />

<NotificationsSetup />

<div class="app">
    <main class="flex flex-col w-screen">
        <Menu>
            {@render children()}
        </Menu>
    </main>
</div>
