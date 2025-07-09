import { showToast } from '#services/toastService';
import { navigate } from '#stores/locationStore';

export const wrappedFetch = async (
    input: RequestInfo,
    options: RequestInit,
    handleSuccess?: (data: any) => void | Promise<void>,
    handleError?: (data: any) => void | Promise<void>
): Promise<any | undefined> => {
    const response: Response = await fetch(input, options);

    if (response.status === 401) {
        try {
            await fetch('/logout', { method: 'POST' });
        } catch (error: any) {
            console.error(error);
        }
        await navigate('/login');
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
