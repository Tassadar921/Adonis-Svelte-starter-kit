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

    let formValues: { name: string; code: string } = $state({
        name: language?.name || '',
        code: language?.code || '',
    });
    let canSubmit: boolean = $state(false);
    let code: string = $state(language?.code || '');
    let file: File | undefined = $state();

    const handleError = (): void => {
        formValues = {
            name: language?.name || '',
            code: language?.code || '',
        };
    };

    $effect((): void => {
        canSubmit = !!formValues.name && !!formValues.code && !!(language?.flag || file);
        console.log(canSubmit, formValues.name, formValues.code, language?.flag, file);
    });
</script>

<AdminForm
    id={language?.code}
    {canSubmit}
    deleteTitle={m['admin.language.delete.title']({ languages: [language?.name] })}
    deleteText={m['admin.language.delete.text']({ languages: [language?.name], count: 1 })}
    onError={handleError}
>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col gap-8">
            <Input name="name" label={m['admin.language.fields.name']()} bind:value={formValues.name} required />
            <Input name="code" label={m['admin.language.fields.code']()} bind:value={formValues.code} disabled={!!language} required />
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
                bind:file
            />
        </div>
    </div>
</AdminForm>
