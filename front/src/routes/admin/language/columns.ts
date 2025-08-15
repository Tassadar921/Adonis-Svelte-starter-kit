import type { ColumnDef } from '@tanstack/table-core';
import { m } from '#lib/paraglide/messages';
import type { SerializedLanguage } from 'backend/types';
import { renderComponent } from '#lib/components/ui/data-table/render-helpers';
import { Checkbox } from '#lib/components/ui/checkbox';
import { SortableColumn, DataTableActions } from '#lib/components/ui/data-table';

export const getLanguageColumns = (onSort: (field: string, order: 'asc' | 'desc') => void, onDelete: (ids: string[]) => void): ColumnDef<SerializedLanguage>[] => [
    {
        id: 'select',
        header: ({ table }) =>
            renderComponent(Checkbox, {
                checked: table.getIsAllPageRowsSelected(),
                indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
                onCheckedChange: (value: boolean): void => table.toggleAllPageRowsSelected(value),
                'aria-label': m['admin.datatable.select.all'](),
            }),
        cell: ({ row }) =>
            renderComponent(Checkbox, {
                checked: row.getIsSelected(),
                'aria-label': m['admin.datatable.select.row'](),
            }),
        enableHiding: false,
    },
    {
        id: m['admin.language.columns.code'](),
        accessorKey: 'code',
        header: ({ column }) =>
            renderComponent(SortableColumn, {
                title: m['admin.language.columns.code'](),
                field: 'code',
                onclick: onSort,
            }),
        enableHiding: false,
    },
    {
        id: m['admin.language.columns.name'](),
        accessorKey: 'name',
        header: ({ column }) =>
            renderComponent(SortableColumn, {
                title: m['admin.language.columns.name'](),
                field: 'name',
                onclick: onSort,
            }),
    },
    {
        id: m['admin.language.columns.fallback'](),
        accessorKey: 'isFallback',
        header: ({ column }) =>
            renderComponent(SortableColumn, {
                title: m['admin.language.columns.fallback'](),
                field: 'isFallback',
                onclick: onSort,
            }),
    },
    {
        header: m['admin.datatable.actions'](),
        enableHiding: false,
        cell: ({ row }) =>
            renderComponent(DataTableActions, {
                id: row.original.code,
                onDelete,
                deleteTitle: m['admin.language.delete.title']({ languages: row.original.name }),
                deleteText: m['admin.language.delete.text']({ languages: row.original.name, count: 1 }),
            }),
    },
];
