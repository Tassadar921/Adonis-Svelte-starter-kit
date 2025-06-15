import vine from '@vinejs/vine';

export const getOneSettingParamsValidator = vine.compile(
    vine.object({
        key: vine.string().trim(),
    })
);

export const updateSettingParamsValidator = vine.compile(
    vine.object({
        key: vine.string().trim(),
    })
);

export const updateSettingValidator = vine.compile(
    vine.object({
        value: vine.union([
            vine.union.if((value: unknown): boolean => typeof value === 'string', vine.string().trim()),
            vine.union.if((value: unknown): boolean => typeof value === 'boolean', vine.boolean()),
            vine.union.if((value: unknown): boolean => typeof value === 'number', vine.number()),
        ]),
    })
);
