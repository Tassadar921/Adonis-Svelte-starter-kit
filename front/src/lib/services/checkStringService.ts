interface CheckEmail {
    (email: string): boolean;
}

interface CheckUuid {
    (uuid: string): boolean;
}

export type CheckPasswordMessageKey =
    | 'common.password.match'
    | 'common.password.length'
    | 'common.password.lowercase'
    | 'common.password.uppercase'
    | 'common.password.number'
    | 'common.password.special-character'
    | '';

export const checkPassword = (password: string, confirmPassword: string): CheckPasswordMessageKey => {
    if (password !== confirmPassword) {
        return 'common.password.match';
    } else if (password.length < 8) {
        return 'common.password.length';
    } else if (!password.match(/[a-z]/)) {
        return 'common.password.lowercase';
    } else if (!password.match(/[A-Z]/)) {
        return 'common.password.uppercase';
    } else if (!password.match(/[0-9]/)) {
        return 'common.password.number';
    } else if (!password.match(/[^a-zA-Z0-9]/)) {
        return 'common.password.special-character';
    } else {
        return '';
    }
};

export const isValidEmail: CheckEmail = (email: string): boolean => {
    const isValidEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return isValidEmailRegex.test(email);
};

export const isValidUuid: CheckUuid = (uuid: string): boolean => {
    const isValidUuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return isValidUuidRegex.test(uuid);
};
