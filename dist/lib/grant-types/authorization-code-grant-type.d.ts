import { AbstractGrantType } from '.';
import { AuthorizationCode, Client, Token, User } from '../interfaces';
import { Request } from '../request';
export declare class AuthorizationCodeGrantType extends AbstractGrantType {
    constructor(options?: any);
    handle(request: Request, client: Client): Promise<Token>;
    getAuthorizationCode(request: Request, client: Client): Promise<AuthorizationCode>;
    validateRedirectUri(request: Request, code: AuthorizationCode): void;
    revokeAuthorizationCode(code: AuthorizationCode): Promise<AuthorizationCode>;
    saveToken(user: User, client: Client, authorizationCode: string, scope: string): Promise<Token>;
}
