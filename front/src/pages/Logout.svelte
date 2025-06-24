<script lang="ts">
    import { showToast } from '../../../../front/src/services/toastService';
    import { navigate } from '../../../../front/src/stores/locationStore';
    import { clearProfile } from '../../../../front/src/stores/profileStore';
    import Subtitle from '../../../../front/src/components/Subtitle.svelte';
    import { t } from 'svelte-i18n';
    import Title from '../../../../front/src/components/Title.svelte';
    import ConfirmModal from '../../../../front/src/components/ConfirmModal.svelte';
    import axios from 'axios';
    import Breadcrumbs from '../../../../front/src/components/Breadcrumbs.svelte';
    import { MetaTags } from 'svelte-meta-tags';

    let showModal: boolean = true;

    const handleSuccess = async (): Promise<void> => {
        try {
            const { data } = await axios.get('/api/logout');
            localStorage.removeItem('apiToken');
            localStorage.removeItem('apiTokenExpiration');
            localStorage.removeItem('subscribed');
            clearProfile();
            showToast(data.message);
            navigate('/login');
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
            navigate('/');
        }
    };

    const handleClose = (): void => {
        navigate('/');
    };
</script>

<MetaTags
    title={$t('logout.meta.title')}
    description={$t('logout.meta.description')}
    keywords={$t('logout.meta.keywords').split(', ')}
    languageAlternates={[
        {
            hrefLang: 'en',
            href: `${import.meta.env.PUBLIC_FRONT_URI}/en/logout`,
        },
        {
            hrefLang: 'fr',
            href: `${import.meta.env.PUBLIC_FRONT_URI}/fr/logout`,
        },
    ]}
    openGraph={{
        title: $t('logout.meta.title'),
        description: $t('logout.meta.description'),
    }}
    twitter={{
        title: $t('logout.meta.title'),
        description: $t('logout.meta.description'),
    }}
/>

<Title title={$t('logout.title')} />

<Breadcrumbs hasBackground items={[{ label: $t('home.title'), path: '/' }, { label: $t('logout.title') }]} />

<ConfirmModal bind:showModal on:success={handleSuccess} on:close={handleClose}>
    <Subtitle slot="header">{$t('logout.modal.title')}</Subtitle>
    <p>{$t('logout.modal.text')}</p>
</ConfirmModal>
