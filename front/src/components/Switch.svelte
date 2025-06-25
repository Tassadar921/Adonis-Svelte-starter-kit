<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    interface Props {
        value?: boolean;
        size?: number;
        disabled?: boolean;
        label?: string;
        name?: string;
        required?: boolean;
    }

    let { value = $bindable(false), size = 2, disabled = false, label = '', name = '', required = false }: Props = $props();

    const handleToggleChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        value = target.checked;
        dispatch('change', value);
    };
</script>

{#if name}
    <input type="checkbox" {name} bind:checked={value} {required} class="absolute opacity-0 cursor-pointer sr-only peer" />
{/if}
<div class="flex gap-3">
    <label class:cursor-pointer={!disabled} class="inline-flex items-center">
        <input type="checkbox" onchange={handleToggleChange} class="sr-only peer" bind:checked={value} {disabled} aria-required={required} />
        <span
            class="relative w-[{size * 8}px] h-[{size * 4 -
                2}px] border border-gray-600 bg-gray-400 dark:bg-gray-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-500 rounded-full peer peer-checked:bg-primary-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white toggle-circle"
        >
            <span
                class="absolute w-[{size * 4}px] h-[{size * 4}px] top-0 left-0 rounded-full transition-all duration-300 border"
                class:bg-primary-500={value}
                class:border-primary-600={value}
                class:bg-white={!value}
                class:border-gray-300={!value}
                style:transform="translateX({value ? size * 4 : 0}px)"
            ></span>
        </span>
    </label>
    {#if label}
        <p
            class:duration-300={value}
            class:transition-colors={value}
            class:text-primary-500={value}
        >
            {label}
            {#if required}
                <span class="text-red-500">*</span>
            {/if}
        </p>
    {/if}
</div>
