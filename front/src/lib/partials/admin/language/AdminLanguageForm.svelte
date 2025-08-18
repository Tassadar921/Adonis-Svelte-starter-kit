<script lang="ts">
    import AdminForm from '#lib/partials/admin/AdminForm.svelte';
    import type { SerializedLanguage } from 'backend/types';
    import { Input } from '#lib/components/ui/input';
    import { m } from '#lib/paraglide/messages';
    import FileUpload from '#components/FileUpload.svelte';

    type Props = {
        language?: SerializedLanguage;
    };

    let { language }: Props = $props();

    let code: string = $state(language?.code || '');
</script>

<AdminForm isNew={!language}>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col gap-8">
            <Input name="name" label={m['admin.language.fields.name']()} value={language?.name} required />
            <Input name="code" label={m['admin.language.fields.code']()} value={language?.code} disabled={!!language} required />
        </div>
        <div>
            <FileUpload
                name="flag"
                accept="png jpg jpeg gif webp svg"
                fileName={language?.flag.name}
                title={m['admin.language.new.flag.title']()}
                description={m['admin.language.new.flag.description']()}
                pathPrefix="language-flag"
                id={code}
                required
            />
        </div>
    </div>
</AdminForm>
