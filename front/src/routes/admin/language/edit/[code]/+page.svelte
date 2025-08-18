<script lang="ts">
    import { page } from '$app/state';
    import AdminLanguageForm from '#lib/partials/admin/language/AdminLanguageForm.svelte';
    import { Title } from '#lib/components/ui/title';
</script>

<Title title={page.data.language.name} />

<AdminLanguageForm language={page.data.language} />
