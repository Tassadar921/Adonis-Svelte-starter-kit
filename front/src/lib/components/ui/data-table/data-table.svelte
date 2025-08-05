<script lang="ts">
    import { getCoreRowModel } from '@tanstack/table-core';
    import type { ColumnDef, RowSelectionState, VisibilityState } from '@tanstack/table-core';
    import { createSvelteTable, FlexRender } from '#lib/components/ui/data-table/index';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#lib/components/ui/table';
    import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '#lib/components/ui/dropdown-menu';
    import { Button } from '#lib/components/ui/button';
    import Search from '#components/Search.svelte';
    import { m } from '#lib/paraglide/messages';

    type Props = {
        data: any[];
        columns: ColumnDef<any>[];
        onSearch: () => void;
        query: string;
        sortBy: string;
    };

    let { data, columns, onSearch, query = $bindable(''), sortBy = $bindable('') }: Props = $props();

    let rowSelection = $state<RowSelectionState>({});
    let columnVisibility = $state<VisibilityState>({});

    const table = createSvelteTable({
        get data() {
            return data;
        },
        onRowSelectionChange: (updater) => {
            if (typeof updater === 'function') {
                rowSelection = updater(rowSelection);
            } else {
                rowSelection = updater;
            }
        },
        onColumnVisibilityChange: (updater) => {
            if (typeof updater === 'function') {
                columnVisibility = updater(columnVisibility);
            } else {
                columnVisibility = updater;
            }
        },
        state: {
            get rowSelection() {
                return rowSelection;
            },
            get columnVisibility() {
                return columnVisibility;
            },
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection: true,
    });
</script>

<div class="flex items-center py-4 justify-between">
    <Search bind:search={query} resultsArray={data} minChars={0} {onSearch} />
    <DropdownMenu>
        <DropdownMenuTrigger>
            {#snippet child({ props })}
                <Button {...props} variant="outline">{m['admin.datatable.columns']()}</Button>
            {/snippet}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            {#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column.id)}
                <DropdownMenuCheckboxItem class="capitalize" bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}>
                    {column.id}
                </DropdownMenuCheckboxItem>
            {/each}
        </DropdownMenuContent>
    </DropdownMenu>
</div>

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

<div class="text-muted-foreground flex-1 text-sm">
    {m['admin.datatable.selected-rows']({ count: table.getFilteredSelectedRowModel().rows.length, total: table.getFilteredRowModel().rows.length })}
</div>
