export type SerializedLanguage = {
    name: string;
    code: string;
    isFallback: boolean;
    updatedAt?: string;
    createdAt?: string;
};

export default SerializedLanguage;
