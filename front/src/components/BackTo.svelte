<script lang="ts">
    import Button from '#components/Button.svelte';
    import Link from '#components/Link.svelte';
    import Icon from '#components/Icon.svelte';

    type Props = {
        href?: string;
        text?: string;
    };

    let { href, text }: Props = $props();
</script>

<Button>
    <Link {href}>
        <div class="inline-block">
            <div class="flex gap-1">
                <Icon name="arrowLeft" />
                <p>{text}</p>
            </div>
        </div>
    </Link>
</Button>
