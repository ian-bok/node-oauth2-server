import { OAuthError } from '../errors';
import { Client, Model } from '../interfaces';
import { Request } from '../request';
import { Response } from '../response';
import { BearerTokenType } from '../token-types';
export declare class TokenHandler {
    accessTokenLifetime: any;
    grantTypes: {
        [key: string]: any;
    };
    model: Model;
    refreshTokenLifetime: number;
    allowExtendedTokenAttributes: boolean;
    requireClientAuthentication: any;
    alwaysIssueNewRefreshToken: boolean;
    constructor(options?: any);
    handle(request: Request, response: Response): Promise<any>;
    getClient(request: Request, response: Response): Promise<Client>;
    getClientCredentials(request: Request): {
        clientId: any;
        clientSecret: any;
    } | {
        clientId: any;
        clientSecret?: undefined;
    };
    handleGrantType(request: Request, client: Client): Promise<any>;
    getAccessTokenLifetime(client: Client): any;
    getRefreshTokenLifetime(client: Client): number;
    getTokenType(model: any): BearerTokenType;
    updateSuccessResponse(response: Response, tokenType: BearerTokenType): void;
    updateErrorResponse(response: Response, error: OAuthError): void;
    isClientAuthenticationRequired(grantType: string): any;
    isPKCERequest(request: Request, grantType: string): boolean;
}
