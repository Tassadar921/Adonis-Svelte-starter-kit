<script lang="ts">
    import { Title } from '#lib/components/ui/title';
    import { m } from '#lib/paraglide/messages';
    import { page } from '$app/state';
    import { onMount } from 'svelte';
    import type { PaginatedLanguages } from 'backend/types';
    import { wrappedFetch } from '#lib/services/requestService';
    import Datatable from './Datatable.svelte';
    import { languageColumns } from './columns';
    import Pagination from '#components/Pagination.svelte';

    let paginatedLanguages: PaginatedLanguages | undefined = $state();
    let query: string = $state('');

    onMount(async (): Promise<void> => {
        if (page.data.isSuccess) {
            paginatedLanguages = page.data.languages;
        } else {
            await getLanguages();
        }
    });

    const getLanguages = async (page: number = 1, limit: number = 10): Promise<void> => {
        await wrappedFetch(`/admin/languages?page=${page}&limit=${limit}&query=${query}`, { method: 'GET' }, (data): void => {
            paginatedLanguages = data.blockedUsers;
        });
    };
</script>

<Title title={m['admin.language.title']()} hasBackground />

{#if paginatedLanguages}
    <Datatable {paginatedLanguages} columns={languageColumns} />
    <Pagination paginatedObject={paginatedLanguages} onChange={async (page: number, limit: number) => await getLanguages(page, limit)} />
{/if}
