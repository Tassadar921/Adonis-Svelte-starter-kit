import { showToast } from '#services/toastService';
import { navigate } from '#stores/locationStore';
import type { PageDataError } from '../app';
import { m } from '#lib/paraglide/messages';

export const wrappedFetch = async (
    input: RequestInfo,
    options: RequestInit,
    onSuccess?: (data: any) => void | Promise<void>,
    onError?: (data: any) => void | Promise<void>
): Promise<any | undefined> => {
    const response: Response = await fetch(input, options);

    if (response.status === 401) {
        try {
            await fetch(new URL('/logout'), { method: 'POST' });
        } catch (error: any) {
            console.error(error);
        }
        await navigate('/login');
    }

    try {
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data: any = await response.json();

        if (data.message) {
            showToast(data.message, data.isSuccess ? 'success' : 'error');
        }

        if (data.isSuccess) {
            await onSuccess?.(data);
        } else {
            await onError?.(data);
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

    if (!errors.length) {
        errors.push({
            type: 'error',
            message: data?.error ?? m['common.error.default-message'](),
        });
    }

    return errors;
};

export const extractFormData = (formData: FormData): Record<string, any> => {
    const data: Record<string, any> = {};

    formData.forEach((value: FormDataEntryValue, key: string): void => {
        if (value instanceof File) {
            if (value.size === 0 && value.name === '') {
                return;
            }

            data[key] = {
                name: value.name,
                type: value.type,
                size: value.size,
            };
        } else {
            const str: string = value.toString().trim();

            if (str === 'true') {
                data[key] = true;
            } else if (str === 'false') {
                data[key] = false;
            } else if (!isNaN(Number(str)) && str !== '') {
                data[key] = Number(str);
            } else {
                data[key] = str;
            }
        }
    });

    return data;
};
