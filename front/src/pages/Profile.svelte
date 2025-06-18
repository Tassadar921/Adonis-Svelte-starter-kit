<script lang="ts">
    import Form from '../../../../front/src/components/Form.svelte';
    import Input from '../../../../front/src/components/Input.svelte';
    import Title from '../../../../front/src/components/Title.svelte';
    import Link from '../../../../front/src/components/Link.svelte';
    import { profile, setProfile } from '../../../../front/src/stores/profileStore';
    import { showToast } from '../../../../front/src/services/toastService';
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import FileUpload from '../../../../front/src/components/FileUpload.svelte';
    import Breadcrumbs from '../../../../front/src/components/Breadcrumbs.svelte';
    import type SerializedUser from 'adonis-svelte-starter-kit-backend/app/types/serialized/serialized_user';
    import { MetaTags } from 'svelte-meta-tags';

    let formValues: { username: string; email: string } = {
        username: '',
        email: '',
    };
    let path: string = '';
    let canSubmit: boolean = false;

    let profileData: SerializedUser = $profile!;

    onMount((): void => {
        formValues = {
            username: $profile?.username || '',
            email: $profile?.email || '',
        };

        if ($profile!.profilePicture) {
            path = `${import.meta.env.VITE_API_BASE_URI}/api/static/profile-picture/${$profile!.id}?token=${localStorage.getItem('apiToken')}`;
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

    $: canSubmit = !!formValues.username && !!formValues.email;
</script>

<MetaTags
    title={$t('profile.meta.title')}
    description={$t('profile.meta.description')}
    keywords={$t('profile.meta.keywords').split(', ')}
    languageAlternates={[
        {
            hrefLang: 'en',
            href: `${import.meta.env.VITE_FRONT_URI}/en/profile`,
        },
        {
            hrefLang: 'fr',
            href: `${import.meta.env.VITE_FRONT_URI}/fr/profile`,
        },
    ]}
    openGraph={{
        title: $t('profile.meta.title'),
        description: $t('profile.meta.description'),
    }}
    twitter={{
        title: $t('profile.meta.title'),
        description: $t('profile.meta.description'),
    }}
/>

<Title title={$t('profile.title')} hasBackground />

<Breadcrumbs hasBackground items={[{ label: $t('home.title'), path: '/' }, { label: $t('social.title'), path: '/social' }, { label: $t('profile.title') }]} />

<Form action="/api/profile/update" method="POST" on:success={handleSuccess} on:error={handleError} isValid={canSubmit}>
    <Input name="username" placeholder={$t('common.username.label')} label={$t('common.username.label')} bind:value={formValues.username} min={3} max={50} />
    <Input name="email" placeholder={$t('common.email.label')} label={$t('common.email.label')} bind:value={formValues.email} disabled />
    <Link href="/reset-password" className="text-primary-500 hover:text-primary-800 transition-colors duration-300">
        {$t('profile.reset-password')}
    </Link>
    <FileUpload
        name="profilePicture"
        accept="png jpg gif jpeg webp"
        fileName={profileData.profilePicture?.name}
        title={$t('profile.profile-picture.title')}
        description={$t('profile.profile-picture.description')}
        pathPrefix="profile-picture"
        id={profileData.id}
    />
</Form>
