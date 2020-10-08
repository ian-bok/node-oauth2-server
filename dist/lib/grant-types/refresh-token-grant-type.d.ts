import { AbstractGrantType } from '.';
import { Client, RefreshToken, User } from '../interfaces';
import { Request } from '../request';
export declare class RefreshTokenGrantType extends AbstractGrantType {
    constructor(options?: any);
    handle(request: Request, client: Client): Promise<import("../interfaces").Token>;
    getRefreshToken(request: Request, client: Client): Promise<RefreshToken>;
    revokeToken(token: RefreshToken): Promise<RefreshToken>;
    saveToken(user: User, client: Client, scope: string): Promise<import("../interfaces").Token>;
}
