import BaseRepository from '#repositories/base/base_repository';
import Setting from '#models/setting';

export default class SettingRepository extends BaseRepository<typeof Setting> {
    constructor() {
        super(Setting);
    }
}
