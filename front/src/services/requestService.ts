import { showToast } from '#services/toastService';
import { navigate } from '#stores/locationStore';
import type { PageDataError } from '../app';

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

export const extractFormErrors = (data: any): PageDataError[] => {
    const errors: PageDataError[] = [];

    // Adonis validator
    if (data?.errors) {
        for (const error of data.errors) {
            errors.push({
                type: 'error',
                message: error.message,
            });
        }
    }

    // Adonis error
    if (data?.error) {
        errors.push({
            type: 'error',
            message: data.error,
        });
    }

    return errors;
};
