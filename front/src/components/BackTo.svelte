<script lang="ts">
    import { Button } from '$lib/components/ui/button/index';
    import { ArrowLeft } from '@lucide/svelte';

    type Props = {
        href?: string;
        text?: string;
    };

    let { href, text }: Props = $props();
</script>

<Button variant="link" {href} class="flex items-center">
    <ArrowLeft class="mb-0.5" />
    <p>{text}</p>
</Button>
