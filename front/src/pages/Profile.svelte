<script lang="ts">
    import Form from '#components/Form.svelte';
    import Input from '#components/Input.svelte';
    import Title from '#components/Title.svelte';
    import Link from '#components/Link.svelte';
    import { profile, setProfile } from '#stores/profileStore';
    import { showToast } from '#services/toastService';
    import { m } from '$lib/paraglide/messages';
    import { onMount } from 'svelte';
    import FileUpload from '#components/FileUpload.svelte';
    import Breadcrumbs from '#components/Breadcrumbs.svelte';
    import type SerializedUser from 'adonis-svelte-starter-kit-backend/app/types/serialized/serialized_user';
    import Meta from '#components/Meta.svelte';

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
            path = `${import.meta.env.PUBLIC_API_BASE_URI}/api/static/profile-picture/${$profile!.id}?token=${localStorage.getItem('apiToken')}`;
        }
    });

    const handleSuccess = (event: CustomEvent): void => {
        setProfile(event.detail.user);
        showToast(event.detail.message);
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

<Breadcrumbs items={[{ label: m['home.title'](), path: '/' }, { label: m['social.title'](), path: '/social' }, { label: m['profile.title']() }]} />

<Form isValid={canSubmit}>
    <Input name="username" placeholder={m['common.username.label']()} label={m['common.username.label']()} bind:value={formValues.username} min={3} max={50} />
    <Input name="email" placeholder={m['common.email.label']()} label={m['common.email.label']()} bind:value={formValues.email} disabled />
    <Link href="/reset-password" className="text-primary-500 hover:text-primary-800 transition-colors duration-300">
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
