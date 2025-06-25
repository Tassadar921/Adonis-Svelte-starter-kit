<script lang="ts">
    interface Props {
        children: () => any;
    }

    let { children }: Props = $props();
</script>

<div class="w-full shadow-2xl rounded-xl bg-gray-200 dark:bg-gray-800 p-3 mb-3">
    {@render children()}
</div>
