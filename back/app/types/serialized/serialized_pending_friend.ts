import { type SerializedUser } from '#types/serialized/serialized_user';
import { type SerializedPendingFriendNotification } from '#types/serialized/serialized_pending_friend_notification';

export type SerializedPendingFriend = {
    id: number;
    friend: SerializedUser;
    notification: SerializedPendingFriendNotification;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedPendingFriend;
