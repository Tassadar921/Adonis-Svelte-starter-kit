import Serialized_setting from '#types/serialized/serialized_setting';

type SerializedUserSetting = {
    value: string | number | boolean;
    setting: Serialized_setting;
};

export default SerializedUserSetting;
