<script lang="ts">
    import { cn } from '#lib/utils';
    import { Popover as PopoverPrimitive } from 'bits-ui';

    let { ref = $bindable(null), class: className, ...restProps }: PopoverPrimitive.TriggerProps = $props();
</script>

<PopoverPrimitive.Trigger bind:ref data-slot="popover-trigger" class={cn('cursor-pointer', className)} {...restProps} />
