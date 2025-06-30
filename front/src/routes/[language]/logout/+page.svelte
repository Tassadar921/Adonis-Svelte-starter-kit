<script lang="ts">
    import { showToast } from '#services/toastService';
    import { navigate } from '#stores/locationStore';
    import { clearProfile } from '#stores/profileStore';
    import { m } from '$lib/paraglide/messages';
    import { Title } from '$lib/components/ui/title';
    import * as AlertDialog from '$lib/components/ui/alert-dialog';
    import Meta from '#components/Meta.svelte';
    import axios from 'axios';
    import { language } from '#stores/languageStore';

    console.log(axios.defaults.baseURL);

    const handleSuccess = async (): Promise<void> => {
        try {
            clearProfile();
            const { data } = await axios.post(`/${$language}/logout`);
            console.log(data);
        } catch (error: any) {
            console.log(error);
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

<AlertDialog.Root open={true}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>{m['logout.modal.title']()}</AlertDialog.Title>
            <AlertDialog.Description>{m['logout.modal.text']()}</AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel onclick={handleClose}>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action onclick={handleSuccess}>Continue</AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
