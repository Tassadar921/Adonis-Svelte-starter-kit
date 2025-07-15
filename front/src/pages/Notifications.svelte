<script lang="ts">
    import { Title } from '#lib/components/ui/title';
    import { m } from '#lib/paraglide/messages';
    import { notifications, removeNotification, setPendingFriendRequests } from '#stores/notificationStore';
    import NotificationModule from '#partials/notifications/NotificationModule.svelte';
    import Loader from '#components/Loader.svelte';
    import { showToast } from '#services/toastService';
    import Meta from '#components/Meta.svelte';
    import { type SerializedPendingFriend } from 'backend/types';

    let isLoading: boolean = false;

    const handleAcceptPendingRequest = async (pendingFriend: SerializedPendingFriend): Promise<void> => {
        try {
            // const { data, error } = await tuyau.api.friends.accept.$post({ userId: pendingFriend.friend.id });
            //
            // error?.value.errors.forEach((error): void => {
            //     showToast(error.message, 'error');
            // });
            //
            // if (data) {
            //     showToast(data., 'success', '/friends');
            // }

            removeNotification(pendingFriend, 'friendRequests');
            if ($notifications.friendRequests.length <= 3) {
                await setPendingFriendRequests();
            }
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };

    const handleRefusePendingRequest = async (pendingFriend: SerializedPendingFriend): Promise<void> => {
        try {
            // const { data } = await axios.post('/api/friends/refuse', { userId: pendingFriend.friend.id });
            // removeNotification(pendingFriend, 'friendRequests');
            // showToast(data.message, 'success', '/friends');
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

<div class="grid grid-cols-1 md:grid-cols-2">
    <NotificationModule
        bind:notifications={$notifications.friendRequests}
        title={m['notifications.friend-requests.title']()}
        noneMessage={m['notifications.friend-requests.none']()}
        onaccept={handleAcceptPendingRequest}
        onrefuse={handleRefusePendingRequest}
    />
</div>
