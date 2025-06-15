<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { locale } from 'svelte-i18n';
    import { setLanguage } from '#stores/languageStore';
    import axios from 'axios';
    import type { PageData } from './$types';

    // Récupérer la langue depuis les données de page
    export let data: PageData;
    $: language = data.language;

    onMount(() => {
        if (language) {
            setLanguage(language);
            locale.set(language);
            axios.defaults.headers.common['Accept-Language'] = `${language}-${language.toUpperCase()}`;
        }
    });
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <nav class="bg-white dark:bg-gray-800 shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <div class="flex-shrink-0 flex items-center">
                        <span class="text-xl font-bold">Admin Panel</span>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
            <slot />
        </div>
    </main>
</div>
