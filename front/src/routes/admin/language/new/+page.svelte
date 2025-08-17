<script lang="ts">
    import { Title } from '#lib/components/ui/title';
    import { m } from '#lib/paraglide/messages';
    import AdminLanguageForm from '#lib/partials/admin/language/AdminLanguageForm.svelte';
</script>

<Title title={m['admin.language.new.title']()} hasBackground />

<AdminLanguageForm isNew />
