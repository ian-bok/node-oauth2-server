import { Client, Model, User } from '../interfaces';
import { Request } from '../request';
export declare class TokenResponseType {
    accessToken: string;
    accessTokenLifetime: number;
    model: Model;
    constructor(options?: any);
    handle(request: Request, client: Client, user: User, uri: string, scope: string): Promise<import("../interfaces").Token>;
    getAccessTokenLifetime(client: Client): number;
    buildRedirectUri(redirectUri: any): any;
    setRedirectUriParam(redirectUri: any, key: string, value: any): any;
}
