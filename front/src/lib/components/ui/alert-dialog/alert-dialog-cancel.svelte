<script lang="ts">
    import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
    import { buttonVariants } from '#lib/components/ui/button';
    import { cn } from '#lib/utils';

    let { ref = $bindable(null), class: className, ...restProps }: AlertDialogPrimitive.CancelProps = $props();
</script>

<AlertDialogPrimitive.Cancel bind:ref data-slot="alert-dialog-cancel" class={cn(buttonVariants({ variant: 'outline' }), className)} {...restProps} />
