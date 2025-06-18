<script lang="ts">
    import Title from '../../../../front/src/components/Title.svelte';
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import { showToast } from '../../../../front/src/services/toastService';
    import { navigate } from '../../../../front/src/stores/locationStore';
    import { updateProfile } from '../../../../front/src/stores/profileStore';
    import Loader from '../../../../front/src/components/Loader.svelte';
    import { MetaTags } from 'svelte-meta-tags';

    export let apiToken: string;

    let apiTokenExpiration: string;

    onMount(async () => {
        const params = new URLSearchParams(window.location.search);
        apiTokenExpiration = params.get('apiTokenExpiration') ?? '';
        if (!apiToken || !apiTokenExpiration) {
            showToast($t('toast.login.error'), 'error');
            navigate('/login');
            return;
        }

        localStorage.setItem('apiToken', apiToken);
        localStorage.setItem('apiTokenExpiration', apiTokenExpiration);
        axios.defaults.headers.common['Authorization'] = `Bearer ${apiToken}`;
        await updateProfile();
        showToast($t('toast.login.success'));
        navigate('/');
    });
</script>

<MetaTags
    title={$t('oauth.meta.title')}
    description={$t('oauth.meta.description')}
    keywords={$t('oauth.meta.keywords').split(', ')}
    languageAlternates={[
        {
            hrefLang: 'en',
            href: `${import.meta.env.VITE_FRONT_URI}/en/oauth/${apiToken}`,
        },
        {
            hrefLang: 'fr',
            href: `${import.meta.env.VITE_FRONT_URI}/fr/oauth/${apiToken}`,
        },
    ]}
    openGraph={{
        title: $t('oauth.meta.title'),
        description: $t('oauth.meta.description'),
    }}
    twitter={{
        title: $t('oauth.meta.title'),
        description: $t('oauth.meta.description'),
    }}
/>

<Title title={$t('oauth.title')} hasBackground={true} />

<Loader />
