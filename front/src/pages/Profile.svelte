<script lang="ts">
    import Form from '#components/Form.svelte';
    import Input from '#components/Input.svelte';
    import { Title } from '#lib/components/ui/title';
    import { Link } from '#lib/components/ui/link';
    import { profile, setProfile } from '#stores/profileStore';
    import { m } from '#lib/paraglide/messages';
    import { onMount } from 'svelte';
    import FileUpload from '#components/FileUpload.svelte';
    import type SerializedUser from 'backend/app/types/serialized/serialized_user';
    import Meta from '#components/Meta.svelte';
    import { PUBLIC_API_BASE_URI } from '$env/static/public';

    let formValues: { username: string; email: string } = $state({
        username: '',
        email: '',
    });
    let path: string = '';
    let canSubmit: boolean = $state(false);

    let profileData: SerializedUser = $profile!;

    onMount((): void => {
        formValues = {
            username: $profile?.username || '',
            email: $profile?.email || '',
        };

        if ($profile!.profilePicture) {
            path = `${PUBLIC_API_BASE_URI}/api/static/profile-picture/${$profile!.id}?token=${localStorage.getItem('apiToken')}`;
        }
    });

    const handleSuccess = (event: CustomEvent): void => {
        setProfile(event.detail.user);
    };

    const handleError = (): void => {
        formValues = {
            username: $profile!.username,
            email: $profile!.email,
        };
    };

    $effect((): void => {
        canSubmit = !!formValues.username && !!formValues.email;
    });
</script>

<Meta title={m['profile.meta.title']()} description={m['profile.meta.description']()} keywords={m['profile.meta.keywords']().split(', ')} pathname="/profile" />

<Title title={m['profile.title']()} hasBackground />

<Form isValid={canSubmit}>
    <Input name="username" placeholder={m['common.username.label']()} label={m['common.username.label']()} bind:value={formValues.username} min={3} max={50} />
    <Input name="email" placeholder={m['common.email.label']()} label={m['common.email.label']()} bind:value={formValues.email} disabled />
    <Link href="/reset-password">
        {m['profile.reset-password']()}
    </Link>
    <FileUpload
        name="profilePicture"
        accept="png jpg gif jpeg webp"
        fileName={profileData.profilePicture?.name}
        title={m['profile.profile-picture.title']()}
        description={m['profile.profile-picture.description']()}
        pathPrefix="profile-picture"
        id={profileData.id}
    />
</Form>
