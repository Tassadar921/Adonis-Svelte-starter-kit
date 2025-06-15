import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import LogUser from '#models/log_user';
import LogRouteMethodEnum from '#types/enum/log_route_method_enum';
import LogResponseStatusEnum from '#types/enum/log_response_status_enum';
import SerializedLog from '#types/serialized/serialized_log';

export default class Log extends BaseModel {
    static connection: string = 'logs';

    @column({ isPrimary: true })
    declare public id: string;

    @column()
    declare public frontId: number;

    @column()
    declare public route: string;

    @column()
    declare public routeMethod: LogRouteMethodEnum;

    @column()
    declare public queryString: Record<string, unknown>;

    @column()
    declare public params?: Record<string, unknown>;

    @column()
    declare public body?: Record<string, unknown>;

    @column()
    declare public responseStatus: LogResponseStatusEnum;

    @column()
    declare public responseBody: Record<string, unknown>;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare public startTime: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare public endTime: DateTime;

    @column()
    declare public userId: string;

    @belongsTo((): typeof LogUser => LogUser, {
        foreignKey: 'userId',
    })
    declare public user: BelongsTo<typeof LogUser>;

    @column.dateTime({ autoCreate: true })
    declare public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare public updatedAt: DateTime;

    public apiSerialize(): SerializedLog {
        return {
            id: this.frontId,
            route: this.route,
            routeMethod: this.routeMethod,
            queryString: this.queryString,
            params: this.params,
            body: this.body,
            responseStatus: this.responseStatus,
            responseBody: this.responseBody,
            startTime: this.startTime.toString(),
            endTime: this.endTime.toString(),
            user: this.user?.apiSerialize(),
            updatedAt: this.updatedAt.toString(),
            createdAt: this.createdAt.toString(),
        };
    }
}
