<script lang="ts">
    import AdminForm from '#lib/partials/admin/AdminForm.svelte';
    import type { SerializedUser } from 'backend/types';
    import { Input } from '#lib/components/ui/input';
    import { m } from '#lib/paraglide/messages';
    import FileUpload from '#components/FileUpload.svelte';
    import { Switch } from '#lib/components/ui/switch';
    import { onMount } from 'svelte';

    type Props = {
        user?: SerializedUser;
    };

    let { user }: Props = $props();

    let formValues = $state({
        email: '',
        username: '',
        enabled: false,
    });
    let canSubmit: boolean = $state(false);
    let file: File | undefined = $state();

    onMount(() => {
        setInitialValues();
    });

    const setInitialValues = (): void => {
        formValues.email = user?.email || '';
        formValues.username = user?.username || '';
        formValues.enabled = user?.enabled || false;
    };

    const handleError = (): void => {
        setInitialValues();
    };

    $effect((): void => {
        canSubmit = !!formValues.username && !!formValues.email;
    });
</script>

<AdminForm
    id={user?.id}
    {canSubmit}
    deleteTitle={m['admin.user.delete.title']({ users: [user?.email] })}
    deleteText={m['admin.user.delete.text']({ users: [user?.email], count: 1 })}
    onError={handleError}
>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col gap-8">
            <Input name="username" label={m['admin.user.fields.username']()} bind:value={formValues.username} required />
            <Input name="email" label={m['admin.user.fields.email']()} bind:value={formValues.email} readonly={!!user} required />
            <Switch name="enabled" label={m['admin.user.fields.enabled']()} bind:checked={formValues.enabled} disabled />
        </div>
        <div>
            <FileUpload
                name="profilePicture"
                accept="png jpg jpeg gif webp svg"
                fileName={user?.profilePicture?.name}
                title={m['admin.user.new.profile-picture.title']()}
                description={m['admin.user.new.profile-picture.description']()}
                pathPrefix="profile-picture"
                id={user?.id || ''}
                bind:file
            />
        </div>
    </div>
</AdminForm>
