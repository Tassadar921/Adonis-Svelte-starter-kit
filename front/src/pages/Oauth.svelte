<script lang="ts">
    import { Title } from '#lib/components/ui/title';
    import { onMount } from 'svelte';
    import { showToast } from '#services/toastService';
    import { navigate } from '#stores/locationStore';
    import { updateProfile } from '#stores/profileStore';
    import Loader from '#components/Loader.svelte';
    import { m } from '#lib/paraglide/messages';
    import Meta from '#components/Meta.svelte';

    onMount(async () => {
        await updateProfile();
        showToast(m['toast.login.success']());
        await navigate('/');
    });
</script>

<Meta title={m['home.meta.title']()} description={m['home.meta.description']()} keywords={m['home.meta.keywords']().split(', ')} pathname="{`/oauth/${apiToken}`}," />

<Title title={m['oauth.title']()} hasBackground />

<Loader />
