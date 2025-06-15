import BaseRepository from '#repositories/base/base_repository';
import UserSetting from '#models/user_setting';
import User from '#models/user';

export default class UserSettingRepository extends BaseRepository<typeof UserSetting> {
    constructor() {
        super(UserSetting);
    }

    public async findOneByKey(user: User, key: string): Promise<UserSetting> {
        return this.Model.query()
            .select('user_settings.*')
            .leftJoin('settings', 'settings.id', 'user_settings.setting_id')
            .where('user_settings.user_id', user.id)
            .where('settings.key', key)
            .firstOrFail();
    }
}
