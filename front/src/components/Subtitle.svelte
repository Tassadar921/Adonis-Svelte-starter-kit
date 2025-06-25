<script lang="ts">
    interface Props {
        children: () => any;
        style?: string;
        className?: string;
    }

    let { children, style = '', className = 'text-xl font-bold relative' }: Props = $props();
</script>

<h2 {style} class={className}>
    {@render children()}
</h2>
