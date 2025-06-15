import SerializedSettingChoice from '#types/serialized/serialized_setting_choice';

type SerializedSetting = {
    key: string;
    choices?: SerializedSettingChoice[];
};

export default SerializedSetting;
