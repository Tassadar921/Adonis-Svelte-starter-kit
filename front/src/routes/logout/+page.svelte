<script lang="ts">
    import { navigate } from '#stores/locationStore';
    import { clearProfile } from '#stores/profileStore';
    import { m } from '#lib/paraglide/messages';
    import { Title } from '#lib/components/ui/title';
    import {
        AlertDialog,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
        AlertDialogAction,
    } from '#lib/components/ui/alert-dialog';
    import Meta from '#components/Meta.svelte';
    import { wrappedFetch } from '#services/requestService';

    const handleConfirm = async (): Promise<void> => {
        clearProfile();
        await wrappedFetch(
            '/logout',
            {
                method: 'POST',
            },
            () => navigate('/login'),
            () => navigate('/login')
        );
    };

    const handleClose = (): void => {
        navigate('/');
    };
</script>

<Meta title={m['logout.meta.title']()} description={m['logout.meta.description']()} keywords={m['logout.meta.keywords']().split(', ')} pathname="/logout" />

<Title title={m['logout.title']()} />

<AlertDialog open={true}>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>{m['logout.modal.title']()}</AlertDialogTitle>
            <AlertDialogDescription>{m['logout.modal.text']()}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel onclick={handleClose}>{m['common.cancel']()}</AlertDialogCancel>
            <AlertDialogAction onclick={handleConfirm}>{m['common.continue']()}</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>
