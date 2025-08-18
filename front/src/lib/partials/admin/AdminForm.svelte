<script lang="ts">
    import { enhance } from '$app/forms';
    import { Button } from '#lib/components/ui/button';
    import { m } from '#lib/paraglide/messages';
    import { page } from '$app/state';
    import type { PageDataError } from '../../../app';
    import { showToast } from '#lib/services/toastService';

    type Props = {
        children: import('svelte').Snippet;
        isNew?: boolean;
        onError?: () => void;
    };

    let { children, isNew, onError }: Props = $props();

    $effect((): void => {
        page.data.formError?.errors.forEach((error: PageDataError) => {
            showToast(error.message, error.type);
            onError?.();
        });
        page.data.formError = undefined;
    });
</script>

<form use:enhance method="POST" enctype="multipart/form-data" class="pt-8 flex flex-col gap-8 rounded-lg shadow-md mt-5 p-3 bg-gray-300 dark:bg-gray-700">
    {@render children?.()}
    <div class="w-full flex justify-end gap-5 pr-5">
        {#if !isNew}
            <Button variant="destructive">
                {m['common.delete']()}
            </Button>
        {/if}
        <Button type="submit" variant="secondary">{m[`common.${isNew ? 'create' : 'update'}`]()}</Button>
    </div>
</form>
