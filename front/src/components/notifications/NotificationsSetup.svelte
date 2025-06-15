<script lang="ts">
    import { transmit } from '../../stores/transmitStore';
    import { addNotification, removeNotification, setPendingFriendRequests } from '../../stores/notificationStore';
    import { showToast } from '../../services/toastService';
    import { t } from 'svelte-i18n';
    import { profile } from '../../stores/profileStore';
    import type SerializedPendingFriend from 'adonis-svelte-starter-kit-backend/app/types/serialized/serialized_pending_friend';
    import type SerializedUser from 'adonis-svelte-starter-kit-backend/app/types/serialized/serialized_user';

    const setupPendingFriendRequests = async (): Promise<void> => {
        const addFriendNotification = $transmit.subscription(`notification/add-friend/${$profile!.id}`);
        await addFriendNotification.create();
        addFriendNotification.onMessage((pendingFriendRequest: SerializedPendingFriend) => {
            addNotification(pendingFriendRequest.notification, 'friendRequests');
            showToast(`${$t('toast.notification.friend-request.ask')} ${pendingFriendRequest.notification.from.username}`, 'warning', '/notifications');
        });

        const cancelAddFriendNotification = $transmit.subscription(`notification/add-friend/cancel/${$profile!.id}`);
        await cancelAddFriendNotification.create();
        cancelAddFriendNotification.onMessage((pendingFriendRequest: SerializedPendingFriend) => {
            removeNotification(pendingFriendRequest.notification, 'friendRequests');
        });

        const acceptFriendRequest = $transmit.subscription(`notification/add-friend/accept/${$profile!.id}`);
        await acceptFriendRequest.create();
        acceptFriendRequest.onMessage((user: SerializedUser) => {
            showToast(`${user.username} ${$t('toast.notification.friend-request.accepted')}`, 'success', '/friends');
        });

        await setPendingFriendRequests();
    };

    const setup = async (): Promise<void> => {
        await setupPendingFriendRequests();
    };

    $: {
        if ($profile) {
            setup();
        }
    }
</script>
