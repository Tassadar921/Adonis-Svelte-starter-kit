<script lang="ts">
    import { showToast } from '#services/toastService';
    import { navigate } from '#stores/locationStore';
    import { clearProfile } from '#stores/profileStore';
    import Subtitle from '#components/Subtitle.svelte';
    import { m } from '$lib/paraglide/messages';
    import Title from '#components/Title.svelte';
    import ConfirmModal from '#components/ConfirmModal.svelte';
    import axios from 'axios';
    import Breadcrumbs from '#components/Breadcrumbs.svelte';
    import Meta from '#components/Meta.svelte';

    let showModal: boolean = true;

    const handleSuccess = async (): Promise<void> => {
        try {
            const { data } = await axios.get('/api/logout');
            localStorage.removeItem('apiToken');
            localStorage.removeItem('apiTokenExpiration');
            localStorage.removeItem('subscribed');
            clearProfile();
            showToast(data.message);
            await navigate('/login');
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
            await navigate('/');
        }
    };

    const handleClose = (): void => {
        navigate('/');
    };
</script>

<Meta title={m['logout.meta.title']()} description={m['logout.meta.description']()} keywords={m['logout.meta.keywords']().split(', ')} pathname="/logout" />

<Title title={m['logout.title']()} />

<Breadcrumbs items={[{ label: m['home.title'](), path: '/' }, { label: m['logout.title']() }]} />

<ConfirmModal bind:showModal on:success={handleSuccess} on:close={handleClose}>
    <Subtitle slot="header">{m['logout.modal.title']()}</Subtitle>
    <p>{m['logout.modal.text']()}</p>
</ConfirmModal>
