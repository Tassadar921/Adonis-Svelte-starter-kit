<script lang="ts">
    import { Title } from '#lib/components/ui/title';
    import { m } from '#lib/paraglide/messages';
    import { page } from '$app/state';
    import { onMount } from 'svelte';
    import type { PaginatedLanguages, SerializedLanguage } from 'backend/types';
    import { wrappedFetch } from '#lib/services/requestService';
    import { DataTable } from '#lib/components/ui/data-table';
    import { getLanguageColumns } from './columns';
    import { Button } from '#lib/components/ui/button';

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

    const handleSort = (field: string, order: 'asc' | 'desc'): void => {
        sortBy = `${field}:${order}`;
        getLanguages();
    };

    const handleDelete = (code: string): void => {
        if (!paginatedLanguages) {
            return;
        }

        paginatedLanguages.languages = paginatedLanguages.languages.filter((language: SerializedLanguage): boolean => language.code !== code);
        paginatedLanguages.total = paginatedLanguages.total - 1;
    };

    const getLanguages = async (page: number = 1, limit: number = 10): Promise<void> => {
        await wrappedFetch(`/admin/language?page=${page}&limit=${limit}&query=${query}&sortBy=${sortBy}`, { method: 'GET' }, (data): void => {
            paginatedLanguages = data.languages;
        });
    };
</script>

<Title title={m['admin.language.title']()} hasBackground />

{#if paginatedLanguages}
    <div class="flex flex-col gap-1 mt-10">
        <DataTable
            paginatedObject={paginatedLanguages}
            data={paginatedLanguages.languages}
            columns={getLanguageColumns(handleSort, handleDelete)}
            onSearch={getLanguages}
            bind:query
            onPaginationChange={async (page: number, limit: number) => await getLanguages(page, limit)}
        />
        <div class="w-full flex justify-end gap-5">
            <Button variant="destructive" disabled={true}>Supprimer</Button>
            <Button variant="secondary" disabled={false}>Nouveau</Button>
        </div>
    </div>
{/if}
