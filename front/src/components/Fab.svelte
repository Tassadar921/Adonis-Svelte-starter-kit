<script lang="ts">
    import Icon from '#components/Icon.svelte';

    type Props = {
        horizontal: 'right' | 'left' | 'middle';
        vertical: 'top' | 'bottom' | 'center';
        icon: string;
        color: keyof typeof colorClasses;
        ariaLabel: string;
        isLoading: boolean;
    };

    let { horizontal = 'right', vertical = 'bottom', icon, color = 'primary', ariaLabel, isLoading = false }: Props = $props();

    const horizontalClasses = {
        right: 'right-4',
        left: 'left-4',
        middle: 'left-1/2 transform -translate-x-1/2',
    };

    const verticalClasses = {
        top: 'top-4',
        bottom: 'bottom-4',
        center: 'top-1/2 transform -translate-y-1/2',
    };

    const colorClasses = {
        red: 'bg-red-500 hover:bg-red-900',
        green: 'bg-green-500 hover:bg-green-900',
        blue: 'bg-blue-500 hover:bg-blue-900',
        primary: 'bg-indigo-500 hover:bg-indigo-900',
        gray: 'bg-gray-500 hover:bg-gray-900',
    };

    const validHorizontal = ['right', 'left', 'middle'];
    const validVertical = ['top', 'bottom', 'center'];

    const buttonClasses: string = `text-white shadow-lg flex items-center justify-center  size-10 rounded-full
        transition-colors duration-300 z[5000]
        ${verticalClasses[vertical]}
        ${horizontalClasses[horizontal]}
        ${colorClasses[color] ?? colorClasses['primary']}`;

    $effect((): void => {
        horizontal = validHorizontal.includes(horizontal) ? horizontal : 'right';
        vertical = validVertical.includes(vertical) ? vertical : 'bottom';
    });
</script>

<button aria-label={ariaLabel} class={buttonClasses} disabled={isLoading}>
    {#key isLoading}
        <Icon name={isLoading ? 'spinner' : icon} size={isLoading ? 30 : undefined} />
    {/key}
</button>
