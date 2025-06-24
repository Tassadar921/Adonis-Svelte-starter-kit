<script lang="ts">
    import Title from '#components/Title.svelte';
    import { m } from '$lib/paraglide/messages';
    import Breadcrumbs from '#components/Breadcrumbs.svelte';
    import { notifications, removeNotification, setPendingFriendRequests } from '#stores/notificationStore';
    import NotificationModule from '#components/NotificationModule.svelte';
    import Loader from '#components/Loader.svelte';
    import axios from 'axios';
    import { showToast } from '#services/toastService';
    import Meta from '#components/Meta.svelte';

    let isLoading: boolean = false;

    const handleAcceptPendingRequest = async (event: CustomEvent): Promise<void> => {
        try {
            const { data } = await axios.post('/api/friends/accept', { userId: event.detail.from.id });
            removeNotification(event.detail, 'friendRequests');
            showToast(data.message, 'success', '/friends');
            if ($notifications.friendRequests.length <= 3) {
                await setPendingFriendRequests();
            }
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };

    const handleRefusePendingRequest = async (event: CustomEvent): Promise<void> => {
        try {
            const { data } = await axios.post('/api/friends/refuse', { userId: event.detail.from.id });
            removeNotification(event.detail, 'friendRequests');
            showToast(data.message, 'success', '/friends');
            if ($notifications.friendRequests.length <= 3) {
                await setPendingFriendRequests();
            }
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };
</script>

<Meta title={m['notifications.meta.title']()} description={m['notifications.meta.description']()} keywords={m['notifications.meta.keywords']().split(', ')} pathname="/notifications" />

<Loader {isLoading} />

<Title title={m['notifications.title']()} />

<Breadcrumbs items={[{ label: m['home.title'](), path: '/' }, { label: m['notifications.title']() }]} />

<div class="grid grid-cols-1 md:grid-cols-2">
    <NotificationModule
        bind:notifications={$notifications.friendRequests}
        title={m['notifications.friend-requests.title']()}
        noneMessage={m['notifications.friend-requests.none']()}
        on:accept={handleAcceptPendingRequest}
        on:refuse={handleRefusePendingRequest}
    />
</div>
