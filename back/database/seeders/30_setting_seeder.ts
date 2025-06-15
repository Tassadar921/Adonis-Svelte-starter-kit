import { BaseSeeder } from '@adonisjs/lucid/seeders';
import SettingRepository from '#repositories/setting_repository';
import SettingChoiceRepository from '#repositories/setting_choice_repository';
import Setting from '#models/setting';
import SettingChoice from '#models/setting_choice';

export default class extends BaseSeeder {
    async run(): Promise<void> {
        const settingRepository: SettingRepository = new SettingRepository();
        const settingChoiceRepository: SettingChoiceRepository = new SettingChoiceRepository();

        const settings: { key: string; choices: { value: string; isDefault?: boolean }[] }[] = [
            {
                key: 'language',
                choices: [
                    {
                        value: 'en',
                        isDefault: true,
                    },
                    {
                        value: 'fr',
                    },
                ],
            },
            {
                key: 'theme',
                choices: [
                    {
                        value: 'light',
                        isDefault: true,
                    },
                    {
                        value: 'dark',
                    },
                ],
            },
        ];

        for (const settingData of settings) {
            let setting: Setting | null = await settingRepository.findOneBy({ key: settingData.key });
            if (!setting) {
                setting = await Setting.create({
                    key: settingData.key,
                });
            }

            for (const choice of settingData.choices) {
                if (!(await settingChoiceRepository.findOneBy({ value: choice.value, settingId: setting.id }))) {
                    await SettingChoice.create({
                        value: choice.value,
                        isDefault: choice.isDefault ?? false,
                        settingId: setting.id,
                    });
                }
            }
        }
    }
}
