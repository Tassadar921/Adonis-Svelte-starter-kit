import { DateTime } from 'luxon';
import hash from '@adonisjs/core/services/hash';
import { compose } from '@adonisjs/core/helpers';
import { afterCreate, BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import SerializedUser from '#types/serialized/serialized_user';
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens';
import File from '#models/file';
import UserRoleEnum from '#types/enum/user_role_enum';
import Friend from '#models/friend';
import BlockedUser from '#models/blocked_user';
import PendingFriend from '#models/pending_friend';
import LogUser from '#models/log_user';
import UserSetting from '#models/user_setting';
import SerializedUserSetting from '#types/serialized/serialized_user_setting';
import SettingRepository from '#repositories/setting_repository';
import Setting from '#models/setting';
import SettingChoice from '#models/setting_choice';

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
    uids: ['email'],
    passwordColumnName: 'password',
});

export default class User extends compose(BaseModel, AuthFinder) {
    @column({ isPrimary: true })
    declare public id: string;

    @column()
    declare public frontId: number;

    @column()
    declare public username: string;

    @column()
    declare public email: string;

    @column()
    declare public password: string;

    @column()
    declare public creationToken: string | null;

    @column()
    declare public role: UserRoleEnum;

    @column()
    declare public enabled: boolean;

    @column()
    declare public acceptedTermsAndConditions: boolean;

    @column()
    declare public isOauth: boolean;

    @column()
    declare public profilePictureId: string | null;

    @belongsTo((): typeof File => File, {
        foreignKey: 'profilePictureId',
    })
    declare public profilePicture: BelongsTo<typeof File>;

    @hasMany((): typeof PendingFriend => PendingFriend)
    declare public pendingFriends: HasMany<typeof PendingFriend>;

    @hasMany((): typeof LogUser => LogUser)
    declare public logs: HasMany<typeof LogUser>;

    @hasMany((): typeof UserSetting => UserSetting)
    declare public settings: HasMany<typeof UserSetting>;

    @hasMany((): typeof Friend => Friend)
    declare public friends: HasMany<typeof Friend>;

    @hasMany((): typeof BlockedUser => BlockedUser)
    declare public blockedUsers: HasMany<typeof BlockedUser>;

    @column.dateTime({ autoCreate: true })
    declare public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare public updatedAt: DateTime;

    @beforeCreate()
    public static async createUserSettings(user: User): Promise<void> {
        const settingsRepository: SettingRepository = new SettingRepository();
        const settings: Setting[] = await settingsRepository.all(['choices']);
        await Promise.all(
            settings.map(async (setting: Setting): Promise<void> => {
                const defaultValue: string | number | boolean | null = setting.choices?.find((choice: SettingChoice): boolean => choice.isDefault)?.value || null;
                await UserSetting.create({
                    userId: user.id,
                    settingId: setting.id,
                    value: defaultValue ?? undefined,
                });
            })
        );
    }

    @afterCreate()
    public static async createLogUser(user: User): Promise<void> {
        await LogUser.create({
            email: user.email,
        });
    }

    static accessTokens: DbAccessTokensProvider<typeof User> = DbAccessTokensProvider.forModel(User, {
        expiresIn: '30 days',
        prefix: 'oat_',
        table: 'auth_access_tokens',
        type: 'auth_token',
        tokenSecretLength: 40,
    });

    public apiSerialize(): SerializedUser {
        return {
            id: this.frontId,
            username: this.username,
            email: this.email,
            role: this.role,
            enabled: this.enabled,
            acceptedTermsAndConditions: this.acceptedTermsAndConditions,
            profilePicture: this.profilePicture?.apiSerialize(),
            settings: this.settings?.map((setting: UserSetting): SerializedUserSetting => setting.apiSerialize()),
            updatedAt: this.updatedAt?.toString(),
            createdAt: this.createdAt?.toString(),
        };
    }
}
