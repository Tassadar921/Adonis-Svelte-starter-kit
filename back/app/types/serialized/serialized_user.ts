import { type UserRoleEnum } from '#types/enum/user_role_enum';
import { type SerializedFile } from '#types/serialized/serialized_file';

export type SerializedUser = {
    id: number;
    username: string;
    email: string;
    role: UserRoleEnum;
    acceptedTermsAndConditions: boolean;
    receivedFriendRequest?: boolean;
    sentFriendRequest?: boolean;
    profilePicture?: SerializedFile;
    updatedAt?: string;
    createdAt?: string;
};

export default SerializedUser;
