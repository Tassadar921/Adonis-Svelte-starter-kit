import { type SerializedUser } from '#types/serialized/serialized_user';

export type SerializedFriend = {
    id: number;
    friend: SerializedUser;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedFriend;
