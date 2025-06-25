<script lang="ts">
    import { navigate } from '#stores/locationStore';
    import { language } from '#stores/languageStore';

    interface Props {
        children: () => any;
        onclick?: (event: MouseEvent) => void;
        onmouseover?: (event: MouseEvent) => void;
        onfocus?: (event: FocusEvent) => void;
        onblur?: (event: FocusEvent) => void;
        onmouseout?: (event: MouseEvent) => void;
        href?: string;
        className?: string;
        target?: string;
        ariaLabel?: string;
        style?: string;
    }

    let { children, onclick, onmouseover, onfocus, onblur, onmouseout, href = '', className, target, ariaLabel, style }: Props = $props();

    let isAbsolute: boolean = href.startsWith('http://') || href.startsWith('https://');

    const handleClick = (event: MouseEvent) => {
        if (target === '' || target === '_self') {
            event.preventDefault();
            if (href) {
                onclick?.(event);
                if (isAbsolute) {
                    window.open(href, target);
                } else {
                    navigate(href);
                }
            }
        }
    };
</script>

<a href={isAbsolute ? href : `/${$language}${href}`} aria-label={ariaLabel} {target} class={className} {style} {onmouseover} {onfocus} {onblur} {onmouseout} onclick={handleClick}>
    {@render children()}
</a>
