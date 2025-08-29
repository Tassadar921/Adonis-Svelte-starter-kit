<script lang="ts">
    import Form from '#components/Form.svelte';
    import { Input } from '#lib/components/ui/input';
    import { Title } from '#lib/components/ui/title';
    import { Link } from '#lib/components/ui/link';
    import { profile } from '#lib/stores/profileStore';
    import { m } from '#lib/paraglide/messages';
    import FileUpload from '#components/FileUpload.svelte';
    import { type SerializedUser } from 'backend/types';
    import Meta from '#components/Meta.svelte';
    import * as zod from 'zod';

    const schema = zod.object({
        username: zod.string().min(3).max(50),
        email: zod.email(),
    });

    let formValues: { username: string; email: string } = $state({
        username: $profile?.username || '',
        email: $profile?.email || '',
    });
    const canSubmit: boolean = $derived(schema.safeParse({ username: formValues.username, email: formValues.email }).success);

    let profileData: SerializedUser = $profile!;

    const handleError = (): void => {
        formValues = {
            username: $profile!.username,
            email: $profile!.email,
        };
    };
</script>

<Meta title={m['profile.meta.title']()} description={m['profile.meta.description']()} keywords={m['profile.meta.keywords']().split(', ')} pathname="/profile" />

<Title title={m['profile.title']()} hasBackground />
<Link href="/reset-password">
    {m['profile.reset-password']()}
</Link>

<Form isValid={canSubmit} onError={handleError}>
    <Input name="username" placeholder={m['common.username.label']()} label={m['common.username.label']()} bind:value={formValues.username} min={3} max={50} required />
    <Input name="email" placeholder={m['common.email.label']()} label={m['common.email.label']()} bind:value={formValues.email} disabled required />
    <FileUpload
        name="profilePicture"
        accept="png jpg jpeg gif webp svg"
        fileName={profileData.profilePicture?.name}
        title={m['profile.profile-picture.title']()}
        description={m['profile.profile-picture.description']()}
        pathPrefix="profile-picture"
        id={profileData.id}
    />
</Form>
