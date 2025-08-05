import type { ColumnDef } from '@tanstack/table-core';
import { m } from '#lib/paraglide/messages';
import type { SerializedLanguage } from 'backend/types';
import { renderComponent } from '#lib/components/ui/data-table/render-helpers';
import { Checkbox } from '#lib/components/ui/checkbox';
import { SortableColumn, DataTableActions } from '#lib/components/ui/data-table';

export const getLanguageColumns = (onSort: () => Promise<void>): ColumnDef<SerializedLanguage>[] => [
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
            renderComponent(Checkbox, {
                checked: row.getIsSelected(),
                'aria-label': 'Select row',
            }),
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
                onclick: onSort(),
            }),
    },
    {
        header: m['admin.datatable.actions'](),
        enableHiding: false,
        cell: ({ row }) => renderComponent(DataTableActions, { id: row.original.code, onEdit: (code: string) => console.log(code) }),
    },
];
