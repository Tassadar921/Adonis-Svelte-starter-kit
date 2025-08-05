<script lang="ts">
    import { Title } from '#lib/components/ui/title';
    import { m } from '#lib/paraglide/messages';
    import { page } from '$app/state';
    import { onMount } from 'svelte';
    import type { PaginatedLanguages } from 'backend/types';
    import { wrappedFetch } from '#lib/services/requestService';
    import { DataTable } from '#lib/components/ui/data-table';
    import { getLanguageColumns } from './columns';
    import Pagination from '#components/Pagination.svelte';

    let paginatedLanguages: PaginatedLanguages | undefined = $state();
    let query: string = $state('');
    let sortBy: string = $state('name:asc');

    onMount(async (): Promise<void> => {
        if (page.data.isSuccess) {
            paginatedLanguages = page.data.languages;
        } else {
            await getLanguages();
        }
    });

    const getLanguages = async (page: number = 1, limit: number = 10): Promise<void> => {
        await wrappedFetch(`/admin/language?page=${page}&limit=${limit}&query=${query}&sortBy=${sortBy}`, { method: 'GET' }, (data): void => {
            paginatedLanguages = data.languages;
        });
    };
</script>

<Title title={m['admin.language.title']()} hasBackground />

{#if paginatedLanguages}
    <div class="flex flex-col gap-1 mt-10">
        <DataTable data={paginatedLanguages.languages} columns={getLanguageColumns(async () => await getLanguages())} onSearch={getLanguages} bind:query bind:sortBy />
        <Pagination paginatedObject={paginatedLanguages} onChange={async (page: number, limit: number) => await getLanguages(page, limit)} />
    </div>
{/if}
