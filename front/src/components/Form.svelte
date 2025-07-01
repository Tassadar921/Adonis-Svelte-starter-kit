<script lang="ts">
    import { enhance } from '$app/forms';
    import Icon from '#components/Icon.svelte';
    import { m } from '$lib/paraglide/messages';
    import FormBackground from '#components/background/FormBackground.svelte';
    import { Button } from '$lib/components/ui/button';
    import { SendHorizontal } from '@lucide/svelte';
    import { Card, CardHeader, CardContent, CardFooter } from '$lib/components/ui/card/index';

    type Props = {
        children: import('svelte').Snippet;
        header?: import('svelte').Snippet;
        links?: import('svelte').Snippet;
        otherButtons?: import('svelte').Snippet;
        form?: {
            error?: string;
        };
        isValid?: boolean;
        submittable?: boolean;
        hasBackground?: boolean;
    };

    let { children, header, links, otherButtons, form, isValid = false, submittable = true, hasBackground = true }: Props = $props();

    let isLoading: boolean = $state(false);
    let isSendButtonDisabled: boolean = $state(false);

    $effect((): void => {
        isSendButtonDisabled = isLoading || !isValid;
    });
</script>

{#if hasBackground}
    <FormBackground />
{/if}

<div class:mt-20={hasBackground} class="flex items-center justify-center">
    <Card class="max-w-md md:max-w-lg">
        <form use:enhance method="POST" class="z-10 flex flex-col gap-3">
            <CardHeader>
                {@render header?.()}
            </CardHeader>
            <CardContent>
                <div class="flex flex-col gap-8">
                    {@render children?.()}
                </div>
                {@render links?.()}

                {#if form?.error}
                    <p class="error">{form.error}</p>
                {/if}
            </CardContent>

            {#if submittable}
                <CardFooter class="flex justify-between">
                    {@render otherButtons?.()}
                    <Button type="submit" disabled={isSendButtonDisabled} size="lg">
                        {#if isLoading}
                            <Icon name="spinner" size={40} />
                        {:else}
                            <p class="text-xl">{m['common.submit']()}</p>
                            <SendHorizontal class="size-6" />
                        {/if}
                    </Button>
                </CardFooter>
            {/if}
        </form>
    </Card>
</div>
