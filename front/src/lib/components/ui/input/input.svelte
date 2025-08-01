<script lang="ts">
    import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
    import { cn, type WithElementRef } from '#lib/utils';
    import { Button } from '#lib/components/ui/button/index';
    import { Eye, EyeOff } from '@lucide/svelte';

    type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

    type Props = WithElementRef<Omit<HTMLInputAttributes, 'type'> & ({ type: 'file'; files?: FileList; label?: undefined } | { type?: InputType; files?: undefined; label: string })>;

    let { ref = $bindable(), value = $bindable(), type = 'text', files = $bindable(), class: className, name, placeholder, required = false, onfocus, onblur, label, ...restProps }: Props = $props();

    let showPassword = $state(false);
    let isFocused = $state(false);

    let isPassword: boolean = $derived(type === 'password');
    let actualType: InputType = $derived(isPassword ? (showPassword ? 'text' : 'password') : type);

    const togglePasswordVisibility = () => {
        showPassword = !showPassword;
    };

    const handleFocus = (event: FocusEvent) => {
        isFocused = true;

        const inputEvent = event as FocusEvent & { currentTarget: EventTarget & HTMLInputElement };
        onfocus?.(inputEvent);
    };

    const handleBlur = (event: FocusEvent) => {
        isFocused = false;

        const inputEvent = event as FocusEvent & { currentTarget: EventTarget & HTMLInputElement };
        onblur?.(inputEvent);
    };
</script>

<div class="relative">
    {#if type === 'file'}
        <input
            bind:this={ref}
            type="file"
            data-slot="input"
            class={cn(
                'selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input ring-offset-background placeholder:text-muted-foreground shadow-xs flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 pt-1.5 text-sm font-medium outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                className
            )}
            {name}
            bind:files
            bind:value
            {...restProps}
        />
    {:else}
        <label
            for={name}
            class="absolute pointer-events-none z-10 transition-all duration-800 ease-in-out font-medium {isFocused || value
                ? 'bottom-9 left-1'
                : 'text-gray-600 dark:text-gray-400 bottom-1.5 left-3'}"
        >
            {label}
            {#if required}
                <span class="text-red-600 font-medium">*</span>
            {/if}
        </label>
        <input
            bind:this={ref}
            type={actualType}
            data-slot="input"
            placeholder={isFocused ? placeholder : ''}
            onfocus={handleFocus}
            onblur={handleBlur}
            class={cn(
                'border-input bg-background selection:bg-primary dark:bg-input/30 selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground shadow-xs flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                isPassword ? 'pr-10' : '',
                className
            )}
            {name}
            bind:value
            {...restProps}
        />

        {#if isPassword}
            <Button type="button" onclick={togglePasswordVisibility} aria-label="Toggle password visibility" variant="ghost" size="icon" class="absolute -top-0.5 right-0 rounded-full">
                {#if showPassword}
                    <EyeOff class="size-6" />
                {:else}
                    <Eye class="size-6" />
                {/if}
            </Button>
        {/if}
    {/if}
</div>
