import { showToast } from '#services/toastService';

export const wrappedFetch = async (input: RequestInfo, init?: RequestInit): Promise<any | undefined> => {
    const response: Response = await fetch(input, init);
    if (!response.ok) {
        showToast(response.statusText, 'error');

        return undefined;
    }

    try {
        const data: any = await response.json();
        if (data.message) {
            showToast(data.message, data.isSuccess ? 'success' : 'error');
        }

        return data;
    } catch (error: any) {
        console.error(error);

        return undefined;
    }
};
