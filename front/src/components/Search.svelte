<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { m } from '$lib/paraglide/messages';

    const dispatch = createEventDispatcher();

    type Props = {
        search: string;
        placeholder: string;
        debounce: number;
        minChars?: number;
        name: string;
        disabled: boolean;
        label: string;
        selected: boolean;
        results: any[];
        selectedObserver: boolean;
    };

    let {
        search = '',
        placeholder = m['common.search'](),
        debounce = 300,
        minChars,
        name = '',
        disabled = false,
        label = '',
        selected = false,
        results = [],
        selectedObserver = false,
    }: Props = $props();

    let searchTimeout: NodeJS.Timeout | undefined;
    let inputElement: HTMLInputElement;
    let focused: boolean = $state(false);

    const searchFunction = async (): Promise<void> => {
        if (minChars && search.length < minChars) {
            results = [];
            return;
        }
        dispatch('search');
    };

    const searchDebounced = (event: KeyboardEvent): void => {
        clearTimeout(searchTimeout);

        if (event.key === 'Enter') {
            event.preventDefault();
            dispatch('search', true);
        } else {
            searchTimeout = setTimeout(searchFunction, debounce);
        }
    };

    const handleFocus = (): void => {
        focused = true;
        dispatch('focus');
    };

    const handleBlur = (): void => {
        focused = false;
        dispatch('blur');
    };

    $effect((): void => {
        if (selectedObserver && selected) {
            inputElement.focus();
        }
    });
</script>

<div class="relative w-full mt-8">
    <label
        for={name}
        class="absolute pointer-events-none z-10 transition-all duration-800 ease-in-out {focused || search.length ? 'text-primary-500 bottom-11 left-1' : 'text-gray-500 bottom-2.5 left-3'}"
    >
        {label}
    </label>
    <input
        bind:this={inputElement}
        onfocus={handleFocus}
        onblur={handleBlur}
        onkeydown={searchDebounced}
        type="search"
        bind:value={search}
        placeholder={focused || search.length ? placeholder : ''}
        {name}
        {disabled}
        class="block w-full px-3 py-2 mt-1 text-base text-gray-800 placeholder-gray-500 border border-gray-300 rounded-md
            shadow-xs focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
</div>

<style>
    label {
        transition:
            bottom 0.8s ease,
            left 0.8s ease,
            color 0.8s ease;
    }
</style>
