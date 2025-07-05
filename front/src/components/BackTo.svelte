<script lang="ts">
    import { ArrowLeft } from '@lucide/svelte';
    import { Link } from '$lib/components/ui/link';

    type Props = {
        href: string;
        text: string;
    };

    let { href, text }: Props = $props();
</script>

<Link {href} class="flex items-center">
    <ArrowLeft class="mb-0.5" />
    <p>{text}</p>
</Link>
