<script lang="ts">
    import { enhance } from '$app/forms';
    import Icon from '#components/Icon.svelte';
    import { m } from '$lib/paraglide/messages';
    import FormBackground from '#components/background/FormBackground.svelte';

    type Props = {
        children: () => any;
        otherOption?: () => any;
        form?: {
            error?: string;
        };
        method?: 'POST' | 'GET';
        action?: string;
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

<div class="flex items-center justify-center">
    <form use:enhance method="POST" class:mt-20={hasBackground} class="relative z-10 bg-gray-300 dark:bg-gray-700 rounded-2xl p-2 md:p-6 w-4/5 md:w-2/3 max-w-xl">
        {@render children?.()}

        {#if form?.error}
            <p class="error">{form.error}</p>
        {/if}

        {#if submittable}
            <div class="w-full flex justify-between mt-4">
                <div>
                    {@render otherOption?.()}
                </div>
                <button
                    type="submit"
                    disabled={isSendButtonDisabled}
                    class:hover:bg-green-700={!isSendButtonDisabled}
                    class="bg-green-600 transition-all duration-300 px-5 py-1.5 rounded-xl text-2xl font-bold flex justify-center items-center gap-3 w-40"
                >
                    {#if isLoading}
                        <Icon name="spinner" size={40} />
                    {:else}
                        <p class="text-white">{m['common.submit']()}</p>
                        <span class="text-primary-400"><Icon name="send" /></span>
                    {/if}
                </button>
            </div>
        {/if}
    </form>
</div>
