<script lang="ts">
    interface Props {
        size?: number;
    }

    let { size = 24 }: Props = $props();
</script>

<svg class="transition-all duration-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 36 36">
    <path fill="#ed2939" d="M36 27a4 4 0 0 1-4 4h-8V5h8a4 4 0 0 1 4 4z" />
    <path fill="#002495" d="M4 5a4 4 0 0 0-4 4v18a4 4 0 0 0 4 4h8V5z" />
    <path fill="#eee" d="M12 5h12v26H12z" />
</svg>
