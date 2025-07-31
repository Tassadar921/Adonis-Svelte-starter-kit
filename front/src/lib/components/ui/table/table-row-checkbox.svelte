<script lang="ts">
    import { Checkbox } from '#lib/components/ui/checkbox';
    import type { Row } from '@tanstack/table-core';

    type Props = {
        row: Row<any>;
    };

    let { row }: Props = $props();

    let checked: boolean = $state(false);

    $effect((): void => {
        console.log(row.getIsSelected());
        checked = row.getIsSelected();
    });

    const toggle = (value: boolean): void => {
        row.toggleSelected(value);
    };
</script>

<Checkbox {checked} onCheckedChange={(event) => toggle(event)} aria-label="Select row" />
