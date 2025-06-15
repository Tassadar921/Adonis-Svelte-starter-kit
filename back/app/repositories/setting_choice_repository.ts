import BaseRepository from '#repositories/base/base_repository';
import SettingChoice from '#models/setting_choice';

export default class SettingChoiceRepository extends BaseRepository<typeof SettingChoice> {
    constructor() {
        super(SettingChoice);
    }
}
