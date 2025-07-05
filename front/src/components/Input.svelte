<script lang="ts">
    import Button from '#components/Button.svelte';
    import Icon from '#components/Icon.svelte';

    type Props = {
        type?: 'text' | 'password' | 'email';
        value: string;
        placeholder: string;
        name: string;
        required?: boolean;
        disabled?: boolean;
        label: string;
        readonly?: boolean;
        min?: number;
        max?: number;
        marginTop?: number;
        marginBottom?: number;
    };

    let { type = 'text', value = $bindable(''), placeholder, name, required = false, disabled = false, label, readonly = false, min, max, marginTop = 10, marginBottom = 5 }: Props = $props();

    interface InputAttributes {
        maxLength?: number;
        minLength?: number;
        max?: number;
        min?: number;
    }

    let realType: string = $state('');
    let inputAttributes: InputAttributes | undefined = $state();

    let focused: boolean = $state(false);

    const classes: string = `rounded-lg bg-gray-400 dark:bg-gray-500 block w-full px-3 py-2 mt-1 text-base text-black placeholder:gray-900 border border-gray-300 shadow-xs shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
        disabled || readonly ? 'bg-gray-300 dark:bg-gray-500' : ''
    }`;

    const typeWorkaround = (node: HTMLInputElement): void => {
        node.type = type;
    };

    const switchType = (): string => (type = type === 'password' ? 'text' : 'password');

    const handleFocus = (): void => {
        focused = true;
    };

    const handleBlur = (): void => {
        focused = false;
    };

    $effect((): void => {
        realType = type;
    });

    $effect((): void => {
        inputAttributes = {
            ...(min !== null && realType !== 'text' && { min }),
            ...(max !== null && realType !== 'text' && { max }),
            ...(realType === 'text' && min !== null && { minlength: min }),
            ...(realType === 'text' && max !== null && { maxlength: max }),
        };
    });
</script>

<div class={`relative mt-${marginTop} mb-${marginBottom}`}>
    <label
        for={name}
        class="absolute pointer-events-none z-10 transition-all duration-800 ease-in-out font-medium {focused || value ? 'text-primary-500 bottom-11 left-1' : 'text-gray-900 bottom-2.5 left-3'}"
    >
        {label}
        {#if required}
            <span class="text-red-600 font-medium">*</span>
        {/if}
    </label>

    {#if realType !== 'password'}
        <input
            onfocus={handleFocus}
            onblur={handleBlur}
            use:typeWorkaround
            bind:value
            placeholder={focused || value ? placeholder : ''}
            {name}
            {required}
            {disabled}
            {readonly}
            class={classes}
            {...inputAttributes}
        />
    {:else if type === 'password'}
        <input
            onfocus={() => (focused = true)}
            onblur={() => (focused = false)}
            use:typeWorkaround
            bind:value
            placeholder={focused || value ? placeholder : ''}
            {name}
            {required}
            {disabled}
            {readonly}
            class={`${classes} pr-9`}
            {...inputAttributes}
        />
        <Button additionalStyle="absolute top-2 right-2" onclick={switchType}>
            <Icon name="eye" />
        </Button>
    {:else}
        <input
            onfocus={() => (focused = true)}
            onblur={() => (focused = false)}
            use:typeWorkaround
            bind:value
            placeholder={focused || value ? placeholder : ''}
            {name}
            {required}
            {disabled}
            {readonly}
            class={`${classes} pr-9`}
            {...inputAttributes}
        />
        <Button additionalStyle="absolute top-2 right-2" onclick={switchType}>
            <Icon name="eyeSlash" />
        </Button>
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
