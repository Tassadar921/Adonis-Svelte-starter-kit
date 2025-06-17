<script lang="ts">
    import Button from '#components/Button.svelte';
    import Link from '#components/Link.svelte';
    import Icon from '#components/Icon.svelte';

    export let href: string;
    export let text: string;
</script>

<Button>
    <Link {href}>
        <div class="inline-block">
            <div class="flex flex-row gap-1">
                <Icon name="arrowLeft" />
                <p>{text}</p>
            </div>
        </div>
    </Link>
</Button>
