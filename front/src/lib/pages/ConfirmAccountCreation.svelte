<script lang="ts">
    import Title from '../shared/Title.svelte';
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import { showToast } from '../../services/toastService';
    import { navigate } from '../../stores/locationStore';
    import { setProfile } from '../../stores/profileStore';

    export let token = '';

    onMount(async () => {
        try {
            const { data } = await axios.get(`/api/account-creation/confirm/${token}`);
            localStorage.setItem('apiToken', data.token.token);
            localStorage.setItem('apiTokenExpiration', data.token.expiresAt);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token.token}`;

            setProfile(data.user);
            showToast(data.message);
            navigate('/');
        } catch (error: any) {
            showToast(error.response.data.message, 'error');
        }
    });
</script>

<Title title={$t('create-account.confirm.title')} hasBackground={true} />
