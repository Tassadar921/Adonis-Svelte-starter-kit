<script lang="ts">
    import Title from '#components/Title.svelte';
    import { m } from '$lib/paraglide/messages';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import { showToast } from '#services/toastService';
    import { navigate } from '#stores/locationStore';
    import { setProfile } from '#stores/profileStore';
    import Meta from '#components/Meta.svelte';

    interface Props {
        token: string;
    }

    let { token }: Props = $props();

    onMount(async () => {
        try {
            const { data } = await axios.get(`/api/account-creation/confirm/${token}`);
            localStorage.setItem('apiToken', data.token.token);
            localStorage.setItem('apiTokenExpiration', data.token.expiresAt);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token.token}`;

            setProfile(data.user);
            showToast(data.message);
            await navigate('/');
        } catch (error: any) {
            showToast(error.response.data.message, 'error');
        }
    });
</script>

<meta name="robots" content="noindex, nofollow" />
<Meta
    title={m['create-account.confirm.meta.title']()}
    description={m['create-account.confirm.meta.description']()}
    keywords={m['create-account.confirm.meta.keywords']().split(', ')}
    pathname={`/create-account/confirm/${token}`}
/>

<Title title={m['create-account.confirm.title']()} hasBackground />
