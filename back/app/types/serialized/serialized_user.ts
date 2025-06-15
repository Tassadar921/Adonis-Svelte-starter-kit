import UserRoleEnum from '#types/enum/user_role_enum';
import SerializedFile from '#types/serialized/serialized_file';
import SerializedUserSetting from '#types/serialized/serialized_user_setting';

type SerializedUser = {
    id: number;
    username: string;
    email: string;
    role: UserRoleEnum;
    enabled: boolean;
    acceptedTermsAndConditions: boolean;
    receivedFriendRequest?: boolean;
    sentFriendRequest?: boolean;
    profilePicture?: SerializedFile;
    settings?: SerializedUserSetting[];
    updatedAt?: string;
    createdAt?: string;
};

export default SerializedUser;
