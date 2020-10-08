import { OAuthError } from '../errors';
import { Client, Model } from '../interfaces';
import { Request } from '../request';
import { Response } from '../response';
export declare class RevokeHandler {
    model: Model;
    constructor(options?: any);
    handle(request: Request, response: Response): Promise<true>;
    handleRevokeToken(request: Request, client: Client): Promise<true>;
    getClient(request: Request, response: Response): Promise<Client>;
    getClientCredentials(request: Request): {
        clientId: any;
        clientSecret: any;
    };
    getTokenFromRequest(request: Request): any;
    getRefreshToken(token: any, client: Client): Promise<import("../interfaces").RefreshToken>;
    getAccessToken(token: string, client: Client): Promise<import("../interfaces").Token>;
    revokeToken(token: any): Promise<true>;
    updateErrorResponse(response: Response, error: OAuthError): void;
}
