<script lang="ts">
    import { onMount } from 'svelte';
    import { isLoading } from 'svelte-i18n';
    import { page } from '$app/state';
    import { locale } from 'svelte-i18n';
    import { setLanguage } from '#stores/languageStore';
    import axios from 'axios';
    import Loader from '#components/shared/Loader.svelte';
    import NotificationsSetup from '#components/notifications/NotificationsSetup.svelte';
    import type { PageData } from './$types';
    import { updateProfile } from '#stores/profileStore';
    import { showToast } from '#services/toastService';
    import { t } from 'svelte-i18n';

    export let data: PageData;
    $: language = data.language;

    onMount(() => {
        if (language) {
            setLanguage(language);
            locale.set(language);
            axios.defaults.headers.common['Accept-Language'] = `${language}-${language.toUpperCase()}`;
        }

        axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URI;

        // Theme
        const theme = localStorage.getItem('theme');
        document.documentElement.classList.toggle('dark', theme === 'dark');
        if (theme !== 'light' && theme !== 'dark') {
            localStorage.setItem('theme', 'light');
        }

        // Session token
        const token = localStorage.getItem('apiToken');
        if (token) {
            logInformations(token);
        }
    });

    async function logInformations(token: string) {
        const tokenExpiresAt = localStorage.getItem('apiTokenExpiration');
        if (tokenExpiresAt && new Date(tokenExpiresAt) < new Date()) {
            localStorage.removeItem('apiToken');
            localStorage.removeItem('apiTokenExpiration');
            // Assume showToast and t imported properly
            showToast($t('toast.token.expired'), 'warning');
            return;
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
            await axios.get('/api');
            await updateProfile();
        } catch (error: any) {
            if (error.response?.data?.errors) {
                error.response.data.errors.forEach((e: any) => {
                    showToast(e.message, 'error');
                });
            } else {
                showToast(error.response?.data?.error || 'Error', 'error');
            }
            localStorage.removeItem('apiToken');
            localStorage.removeItem('apiTokenExpiration');
            axios.defaults.headers.common['Authorization'] = '';
        }
    }
</script>

<NotificationsSetup />

<main class="flex flex-col bg-gray-200 dark:bg-gray-900 h-screen w-screen">
    {#if !$isLoading}
        <slot />
    {:else}
        <Loader isLoading />
    {/if}
</main>
