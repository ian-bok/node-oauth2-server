import { AuthorizationCode, Client, RefreshToken, Token, User } from '.';
import { Request } from '../request';
export interface BaseModel {
    request: Request;
    generateAccessToken?(client: Client, user: User, scope: string): Promise<string>;
    getClient(clientId: string, clientSecret?: string): Promise<Client>;
    saveToken(token: Token, client: Client, user: User): Promise<Token>;
}
export interface RequestAuthenticationModel {
    getAccessToken(accessToken: string): Promise<Token>;
    verifyScope(token: Token, scope: string): Promise<boolean>;
}
export interface AuthorizationCodeModel extends BaseModel, RequestAuthenticationModel {
    generateRefreshToken?(client: Client, user: User, scope: string): Promise<string>;
    generateAuthorizationCode?(client: Client, user: User, scope: string): Promise<string>;
    getAuthorizationCode(authorizationCode: string): Promise<AuthorizationCode>;
    saveAuthorizationCode(code: AuthorizationCode, client: Client, user: User): Promise<AuthorizationCode>;
    revokeAuthorizationCode(code: AuthorizationCode): Promise<boolean>;
    validateScope?(user: User, client: Client, scope: string): Promise<string>;
}
export interface PasswordModel extends BaseModel, RequestAuthenticationModel {
    generateRefreshToken?(client: Client, user: User, scope: string): Promise<string>;
    getUser(username: string, password: string): Promise<User>;
    validateScope?(user: User, client: Client, scope: string): Promise<string>;
}
export interface RefreshTokenModel extends BaseModel, RequestAuthenticationModel {
    generateRefreshToken?(client: Client, user: User, scope: string): Promise<string>;
    getRefreshToken(refreshToken: string): Promise<RefreshToken>;
    revokeToken(token: RefreshToken | Token): Promise<boolean>;
}
export interface ClientCredentialsModel extends BaseModel, RequestAuthenticationModel {
    getUserFromClient(client: Client): Promise<User>;
    validateScope?(user: User, client: Client, scope: string): Promise<string>;
}
export interface ExtensionModel extends BaseModel, RequestAuthenticationModel {
}
export interface Model extends BaseModel, RequestAuthenticationModel, AuthorizationCodeModel, PasswordModel, RefreshTokenModel, ClientCredentialsModel {
}
