import { type LogResponseStatusEnum } from '#types/enum/log_response_status_enum';
import { type LogRouteMethodEnum } from '#types/enum/log_route_method_enum';
import { type SerializedLogUser } from '#types/serialized/serialized_log_user';

export type SerializedLog = {
    id: number;
    route: string;
    routeMethod: LogRouteMethodEnum;
    queryString?: Record<string, unknown>;
    params?: Record<string, unknown>;
    body?: Record<string, unknown>;
    responseStatus: LogResponseStatusEnum;
    responseBody: Record<string, unknown>;
    startTime: string;
    endTime: string;
    user?: SerializedLogUser;
    updatedAt?: string;
    createdAt?: string;
};

export default SerializedLog;
