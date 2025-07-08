import { showToast } from '#services/toastService';

export const wrappedFetch = async (
    input: RequestInfo,
    options: RequestInit,
    handleSuccess?: (data: any) => void | Promise<void>,
    handleError?: (data: any) => void | Promise<void>
): Promise<any | undefined> => {
    const response: Response = await fetch(input, options);

    if (!response.ok) {
        showToast(response.statusText, 'error');
        return undefined;
    }

    try {
        const data: any = await response.json();

        if (data.message) {
            showToast(data.message, data.isSuccess ? 'success' : 'error');
        }

        if (data.isSuccess) {
            await handleSuccess?.(data);
        } else {
            await handleError?.(data);
        }

        return data;
    } catch (error: any) {
        console.error(error);
        return undefined;
    }
};
