import { type SerializedUser } from '#types/serialized/serialized_user';
import { type NotificationTypeEnum } from '#types/enum/notification_type_enum';

export type SerializedPendingFriendNotification = {
    id: number;
    seen: boolean;
    from: SerializedUser;
    type: NotificationTypeEnum.PENDING_FRIEND;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedPendingFriendNotification;
