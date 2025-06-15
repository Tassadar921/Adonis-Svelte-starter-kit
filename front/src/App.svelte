<script lang="ts">
    import { Router } from 'svelte-routing';
    import { profile } from './stores/profileStore';
    import { isLoading } from 'svelte-i18n';
    import Loader from '#components/shared/Loader.svelte';
    import NotificationsSetup from './components/notifications/NotificationsSetup.svelte';
</script>

<NotificationsSetup />

<main class="flex flex-col bg-gray-200 dark:bg-gray-900 h-screen w-screen"></main>
