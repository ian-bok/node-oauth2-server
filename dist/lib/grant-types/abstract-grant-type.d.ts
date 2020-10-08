import { Client, Model, User } from '../interfaces';
import { Request } from '../request';
export declare class AbstractGrantType {
    accessTokenLifetime: number;
    model: Model;
    refreshTokenLifetime: number;
    alwaysIssueNewRefreshToken: boolean;
    constructor(options?: any);
    generateAccessToken(client?: Client, user?: User, scope?: string): Promise<string>;
    generateRefreshToken(client?: Client, user?: User, scope?: string): Promise<string>;
    getAccessTokenExpiresAt(): Date;
    getRefreshTokenExpiresAt(): Date;
    getScope(request: Request): any;
    validateScope(user: User, client: Client, scope: string): Promise<string>;
}
