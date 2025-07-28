<script lang="ts">
    import { Title } from '#lib/components/ui/title';
    import { m } from '#lib/paraglide/messages';
    import Meta from '#components/Meta.svelte';
</script>

<Meta title={m['admin.meta.title']()} description={m['admin.meta.description']()} keywords={m['admin.meta.keywords']().split(', ')} pathname="/admin" />

<Title title={m['admin.title']()} hasBackground />
