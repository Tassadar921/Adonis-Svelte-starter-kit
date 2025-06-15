import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';
import UserSettingRepository from '#repositories/user_setting_repository';
import UserSetting from '#models/user_setting';
import SerializedUserSetting from '#types/serialized/serialized_user_setting';
import { getOneSettingParamsValidator, updateSettingParamsValidator, updateSettingValidator } from '#validators/user_setting';
import cache from '@adonisjs/cache/services/main';

@inject()
export default class UserSettingController {
    constructor(private readonly userSettingRepository: UserSettingRepository) {}

    public async getAll({ response, user }: HttpContext): Promise<void> {
        const settings: UserSetting[] = await cache.getOrSet({
            key: `settings`,
            ttl: '1h',
            factory: async (): Promise<UserSetting[]> => {
                return this.userSettingRepository.findBy({ userId: user.id });
            },
        });

        return response.send(settings.map((setting: UserSetting): SerializedUserSetting => setting.apiSerialize()));
    }

    public async getOne({ request, response, user }: HttpContext): Promise<void> {
        const { key } = await getOneSettingParamsValidator.validate(request.params());
        const setting: UserSetting = await this.userSettingRepository.findOneByKey(user, key);

        return response.send(setting.apiSerialize());
    }

    public async update({ request, response, user }: HttpContext): Promise<void> {
        const { key } = await updateSettingParamsValidator.validate(request.params());
        const { value } = await request.validateUsing(updateSettingValidator);

        const setting: UserSetting = await this.userSettingRepository.findOneByKey(user, key);
        setting.value = value;
        await setting.save();

        return response.send(setting.apiSerialize());
    }
}
