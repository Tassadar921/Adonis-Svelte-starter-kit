import BaseRepository from '#repositories/base/base_repository';
import AuthAccessToken from '#models/auth_access_token';

export default class AuthAccessTokenRepository extends BaseRepository<typeof AuthAccessToken> {
    constructor() {
        super(AuthAccessToken);
    }

    public async findActiveByToken(token: string): Promise<AuthAccessToken | null> {
        return AuthAccessToken.query().where('token', token).whereNull('deleted_at').first();
    }
}
