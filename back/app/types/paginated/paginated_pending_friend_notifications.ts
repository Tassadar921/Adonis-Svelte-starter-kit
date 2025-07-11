import { type SerializedPendingFriendNotification } from '#types/serialized/serialized_pending_friend_notification';

export type PaginatedPendingFriendNotifications = {
    notifications: SerializedPendingFriendNotification[];
    firstPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    currentPage: number;
};

export default PaginatedPendingFriendNotifications;
