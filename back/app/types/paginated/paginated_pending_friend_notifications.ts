import type { SerializedPendingFriendNotification } from '../serialized/serialized_pending_friend_notification.js';

export type PaginatedPendingFriendNotifications = {
    notifications: SerializedPendingFriendNotification[];
    firstPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    currentPage: number;
};

export default PaginatedPendingFriendNotifications;
