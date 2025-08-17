<script lang="ts">
    import AdminForm from '#lib/partials/admin/AdminForm.svelte';
    import type { SerializedLanguage } from 'backend/types';
    import { Input } from '#lib/components/ui/input';
    import { m } from '#lib/paraglide/messages';

    type Props = {
        language?: SerializedLanguage;
    };

    let { language }: Props = $props();
</script>

<AdminForm isNew={!language}>
    <Input name="name" label={m['admin.language.fields.name']()} value={language?.name} />
    <Input name="code" label={m['admin.language.fields.code']()} value={language?.code} />
</AdminForm>
