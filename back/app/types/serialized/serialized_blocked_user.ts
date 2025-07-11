import { type SerializedUser } from '#types/serialized/serialized_user';

export type SerializedBlockedUser = {
    id: number;
    user: SerializedUser;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedBlockedUser;
