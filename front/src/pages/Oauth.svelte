<script lang="ts">
    import Title from '#components/Title.svelte';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import { showToast } from '#services/toastService';
    import { navigate } from '#stores/locationStore';
    import { updateProfile } from '#stores/profileStore';
    import Loader from '#components/Loader.svelte';
    import { m } from '$lib/paraglide/messages';
    import Meta from '#components/Meta.svelte';
    import { PUBLIC_FRONT_URI } from '$env/static/public';

    export let apiToken: string;

    let apiTokenExpiration: string;

    onMount(async () => {
        const params = new URLSearchParams(window.location.search);
        apiTokenExpiration = params.get('apiTokenExpiration') ?? '';
        if (!apiToken || !apiTokenExpiration) {
            showToast(m['toast.login.error'](), 'error');
            await navigate('/login');
            return;
        }

        localStorage.setItem('apiToken', apiToken);
        localStorage.setItem('apiTokenExpiration', apiTokenExpiration);
        axios.defaults.headers.common['Authorization'] = `Bearer ${apiToken}`;
        await updateProfile();
        showToast(m['toast.login.success']());
        await navigate('/');
    });
</script>

<Meta title={m['home.meta.title']()} description={m['home.meta.description']()} keywords={m['home.meta.keywords']().split(', ')} pathname="{`/oauth/${apiToken}`}," />

<Title title={m['oauth.title']()} hasBackground />

<Loader />
