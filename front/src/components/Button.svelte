<script lang="ts">
    interface Props {
        children: () => any;
        onclick?: () => any;
        onmouseover?: () => any;
        onfocus?: () => any;
        onblur?: () => any;
        onmouseout?: () => any;
        type?: 'button' | 'reset' | 'submit';
        disabled?: boolean;
        id?: string;
        className?: string;
        additionalStyle?: string;
        customStyle?: boolean;
        ariaLabel?: string;
        style?: string;
        title?: string;
    }

    let { children, onclick, onmouseover, onfocus, onblur, onmouseout, type = 'button', disabled = false, id = '', className, additionalStyle, customStyle, ariaLabel, style, title }: Props = $props();
</script>

<button
    {disabled}
    {id}
    {type}
    {title}
    aria-label={ariaLabel}
    {onclick}
    {onmouseover}
    {onfocus}
    {onblur}
    {onmouseout}
    {style}
    class="{customStyle ? className : `rounded ${disabled ? '' : 'hover:scale-[1.15] text-primary-500 hover:text-primary-300'} transition-all duration-300`} {additionalStyle}"
>
    {@render children()}
</button>
