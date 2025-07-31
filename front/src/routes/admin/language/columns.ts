import type { ColumnDef } from '@tanstack/table-core';
import { m } from '#lib/paraglide/messages';
import type { SerializedLanguage } from 'backend/types';
import { renderComponent } from '#lib/components/ui/data-table/render-helpers';
import { Checkbox } from '#lib/components/ui/checkbox';
import { SortableColumn } from '#lib/components/ui/data-table';
import { TableRowCheckbox } from '#lib/components/ui/table';

export const languageColumns: ColumnDef<SerializedLanguage>[] = [
    {
        id: 'select',
        header: ({ table }) =>
            renderComponent(Checkbox, {
                checked: table.getIsAllPageRowsSelected(),
                indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
                onCheckedChange: (value: boolean): void => table.toggleAllPageRowsSelected(value),
                'aria-label': 'Select all',
            }),
        cell: ({ row }) =>
            renderComponent(TableRowCheckbox, {
                row,
            }),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'code',
        header: ({ column }) =>
            renderComponent(SortableColumn, {
                title: m['admin.language.columns.code'](),
                onclick: column.getToggleSortingHandler(),
            }),
    },
    {
        accessorKey: 'name',
        header: ({ column }) =>
            renderComponent(SortableColumn, {
                title: m['admin.language.columns.name'](),
                onclick: column.getToggleSortingHandler(),
            }),
    },
    // {
    //     id: "actions",
    //     enableHiding: false,
    //     cell: ({ row }) =>
    //         renderComponent(DataTableActions, { id: row.original.id })
    // }
];
