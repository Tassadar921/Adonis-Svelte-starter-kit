<script lang="ts">
    interface Props {
        value?: string;
        placeholder: string;
        name: string;
        required?: boolean;
        disabled?: boolean;
        label: string;
        min?: number;
        max?: number;
    }

    let { value = $bindable(''), placeholder, name, required = false, disabled = false, label, min, max }: Props = $props();

    interface InputAttributes {
        maxlength?: number;
        minlength?: number;
    }

    let focused: boolean = $state(false);

    const classes: string = ``;

    const inputAttributes: InputAttributes = {
        ...(min !== undefined && { minlength: min }),
        ...(max !== undefined && { maxlength: max }),
    };
</script>

<div class="relative w-full mt-10 mb-5">
    <label
        for={name}
        class="absolute pointer-events-none z-10 transition-all duration-800 ease-in-out {focused || value
            ? `text-primary-500 ${inputAttributes.minlength || inputAttributes.maxlength ? 'bottom-21' : 'bottom-16'} left-1`
            : 'text-gray-500 bottom-11 left-3'}"
    >
        {label}
        {#if required}
            <span class="text-red-500">*</span>
        {/if}
    </label>

    <textarea
        onfocus={() => (focused = true)}
        onblur={() => (focused = false)}
        bind:value
        placeholder={focused || value ? placeholder : ''}
        {name}
        {required}
        {disabled}
        class:bg-gray-300={disabled}
        class:dark:bg-gray-500={disabled}
        class="block w-full px-3 py-2 mt-1 text-base text-gray-800 placeholder-gray-500 border border-gray-300 rounded-md shadow-xs focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        {...inputAttributes}
    ></textarea>
    {#if inputAttributes.minlength && value.length < inputAttributes.minlength}
        <p class="text-right">
            <span class="text-red-500">
                {value.length}/{inputAttributes.minlength}
            </span>
        </p>
    {:else if inputAttributes.maxlength}
        <p class="text-right">
            <span class={value.length > inputAttributes.maxlength ? 'text-red-500' : ''}>
                {value.length}/{inputAttributes.maxlength}
            </span>
        </p>
    {/if}
</div>

<style>
    label {
        transition:
            bottom 0.8s ease,
            left 0.8s ease,
            color 0.8s ease;
    }
</style>
