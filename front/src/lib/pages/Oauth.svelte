<script lang="ts">
    import Title from '../shared/Title.svelte';
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import { showToast } from '../../services/toastService';
    import { navigate } from '../../stores/locationStore';
    import { updateProfile } from '../../stores/profileStore';
    import Loader from '../shared/Loader.svelte';

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

<Title title={$t('create-account.confirm.title')} hasBackground={true} />

<Loader />
