<script lang="ts">
    import { enhance } from '$app/forms';
    import Icon from '#components/Icon.svelte';
    import { m } from '$lib/paraglide/messages';
    import FormBackground from '#components/background/FormBackground.svelte';
    import { Button } from '$lib/components/ui/button';
    import { SendHorizontal } from '@lucide/svelte';
    import * as Card from '$lib/components/ui/card/index';

    type Props = {
        children: import('svelte').Snippet;
        otherOption?: import('svelte').Snippet;
        form?: {
            error?: string;
        };
        isValid?: boolean;
        submittable?: boolean;
        hasBackground?: boolean;
    };

    let { children, otherOption, form, isValid = false, submittable = true, hasBackground = true }: Props = $props();

    let isLoading: boolean = $state(false);
    let isSendButtonDisabled: boolean = $state(false);

    $effect((): void => {
        isSendButtonDisabled = isLoading || !isValid;
    });
</script>

{#if hasBackground}
    <FormBackground />
{/if}

<Card.Root class="w-full max-w-sm">
    <form use:enhance method="POST" class:mt-20={hasBackground} class="relative z-10 bg-gray-300 dark:bg-gray-700 rounded-2xl p-2 md:p-6 w-4/5 md:w-2/3 max-w-xl flex flex-col gap-3">
        <Card.Content>
            <div class="flex flex-col gap-8">
                {@render children?.()}
            </div>

            {#if form?.error}
                <p class="error">{form.error}</p>
            {/if}
        </Card.Content>

        {#if submittable}
            <Card.Footer class="flex justify-between">
                <Button type="submit" disabled={isSendButtonDisabled} size="lg">
                    {#if isLoading}
                        <Icon name="spinner" size={40} />
                    {:else}
                        <p class="text-xl">{m['common.submit']()}</p>
                        <SendHorizontal class="size-6" />
                    {/if}
                </Button>
                {@render otherOption?.()}
            </Card.Footer>
        {/if}
    </form>
</Card.Root>
