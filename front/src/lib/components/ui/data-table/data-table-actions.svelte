<script lang="ts">
    import { Button } from '$lib/components/ui/button/index.js';
    import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '$lib/components/ui/dropdown-menu/index';
    import { EllipsisIcon, Trash, Pencil } from '@lucide/svelte';
    import { m } from '#lib/paraglide/messages';

    type Props = {
        id: string;
        onEdit?: (id: string) => void;
        onDelete?: (id: string) => void;
    };

    let { id, onEdit, onDelete }: Props = $props();
</script>

<DropdownMenu>
    <DropdownMenuTrigger>
        {#snippet child({ props })}
            <Button {...props} variant="ghost" size="icon" class="size-0 px-2 flex items-center">
                <EllipsisIcon class="size-5" />
            </Button>
        {/snippet}
    </DropdownMenuTrigger>
    <DropdownMenuContent>
        <DropdownMenuItem disabled={!onEdit} onclick={() => onEdit?.(id)} class="flex gap-1">
            <Pencil class="size-4" />
            {m['common.edit']()}
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!onDelete} onclick={() => onDelete?.(id)} class="flex gap-1">
            <Trash class="size-4" />
            {m['common.delete']()}
        </DropdownMenuItem>
    </DropdownMenuContent>
</DropdownMenu>
