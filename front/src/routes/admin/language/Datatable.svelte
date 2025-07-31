<script lang="ts">
    import { type ColumnDef, getCoreRowModel } from '@tanstack/table-core';
    import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$lib/components/ui/table';
    import type { PaginatedLanguages, SerializedLanguage } from 'backend/types';

    type Props = {
        paginatedLanguages: PaginatedLanguages;
        columns: ColumnDef<SerializedLanguage>[];
    };

    let { paginatedLanguages, columns }: Props = $props();

    const table = createSvelteTable({
        get data() {
            return paginatedLanguages?.languages;
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection: true,
    });
</script>

<div class="rounded-md border bg-gray-300 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-800">
    <Table>
        <TableHeader>
            {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
                <TableRow>
                    {#each headerGroup.headers as header (header.id)}
                        <TableHead colspan={header.colSpan}>
                            {#if !header.isPlaceholder}
                                <FlexRender content={header.column.columnDef.header} context={header.getContext()} />
                            {/if}
                        </TableHead>
                    {/each}
                </TableRow>
            {/each}
        </TableHeader>
        <TableBody>
            {#each table.getRowModel().rows as row (row.id)}
                <TableRow
                    data-state={row.getIsSelected() && 'selected'}
                    onclick={() => {
                        row.toggleSelected(!row.getIsSelected());
                        // console.log(row.getIsSelected())
                    }}
                >
                    {#each row.getVisibleCells() as cell (cell.id)}
                        <TableCell>
                            <FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
                        </TableCell>
                    {/each}
                </TableRow>
            {:else}
                <TableRow>
                    <TableCell colspan={columns.length} class="h-24 text-center">No results.</TableCell>
                </TableRow>
            {/each}
        </TableBody>
    </Table>
</div>
