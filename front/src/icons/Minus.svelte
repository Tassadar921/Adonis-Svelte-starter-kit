<script lang="ts">
    interface Props {
        size?: number;
    }

    let { size = 24 }: Props = $props();
</script>

<svg class="transition-all duration-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path fill="currentColor" d="M19 12.998H5v-2h14z" />
</svg>
