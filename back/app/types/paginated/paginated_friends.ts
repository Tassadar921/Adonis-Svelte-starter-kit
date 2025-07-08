import { type SerializedFriend } from '#types/serialized/serialized_friend';

export type PaginatedFriends = {
    friends: SerializedFriend[];
    firstPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    currentPage: number;
};

export default PaginatedFriends;
