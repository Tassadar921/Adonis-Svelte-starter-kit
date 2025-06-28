import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import cache from '@adonisjs/cache/services/main';
import AuthAccessToken from '#models/auth_access_token';
import { inject } from '@adonisjs/core';
import AuthAccessTokenRepository from '#repositories/auth_access_token_repository';
import { DateTime } from 'luxon';
import UserRepository from '#repositories/user_repository';

@inject()
export default class AuthMiddleware {
    constructor(
        private readonly authAccessTokenRepository: AuthAccessTokenRepository,
        private readonly userRepository: UserRepository
    ) {}

    async handle(ctx: HttpContext, next: NextFn): Promise<any> {
        const token: string | null = ctx.request.cookie('apiToken');

        if (!token) {
            return ctx.response.unauthorized({ error: 'Missing token' });
        }

        const redisKey = `token:${token}`;

        try {
            let userId: string | null = await cache.get({ key: redisKey });

            if (!userId) {
                const authAccessToken: AuthAccessToken | null = await this.authAccessTokenRepository.findActiveByToken(token);

                if (!authAccessToken || !authAccessToken.tokenableId) {
                    return ctx.response.unauthorized({ error: 'Invalid token' });
                }

                if (authAccessToken.expiresAt && authAccessToken.expiresAt < DateTime.now()) {
                    return ctx.response.unauthorized({ error: 'Token expired' });
                }

                userId = authAccessToken.tokenableId;

                await cache.set({
                    key: redisKey,
                    ttl: '1h',
                    value: userId,
                });
            }

            ctx.user = await this.userRepository.firstOrFail({ id: userId });

            await next();
        } catch (error: any) {
            console.error(error);
            return ctx.response.unauthorized({ error: 'Invalid token' });
        }
    }
}
