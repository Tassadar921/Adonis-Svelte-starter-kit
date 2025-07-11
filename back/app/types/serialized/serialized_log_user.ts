import { type SerializedLog } from '#types/serialized/serialized_log';

export type SerializedLogUser = {
    id: number;
    email: string;
    logs?: SerializedLog[];
    updatedAt?: string;
    createdAt?: string;
};

export default SerializedLogUser;
