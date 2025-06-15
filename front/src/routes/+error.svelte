<script lang="ts">
    import NotFound from '../pages/NotFound.svelte';
    import Forbidden from '../pages/Forbidden.svelte';
    import { onMount } from 'svelte';

    export let error: Error | undefined;
    export let status: number;

    let errorMessage: string = 'An unknown error occurred';

    onMount(() => {
        if (error) {
            errorMessage = error.message || 'An unknown error occurred';
        }
    });
</script>

{#if status === 404}
    <NotFound />
{:else if status === 401}
    <Forbidden />
{:else}
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
            <h1 class="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error {status}</h1>
            <p class="text-gray-700 dark:text-gray-300">{errorMessage}</p>
            <a href="/" class="mt-4 inline-block text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-500">Return to homepage</a>
        </div>
    </div>
{/if}
