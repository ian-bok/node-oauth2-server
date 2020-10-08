/// <reference types="node" />
import * as url from 'url';
import { Client, Model, User } from '../interfaces';
import { Request } from '../request';
import { Response } from '../response';
import { CodeResponseType, TokenResponseType } from '../response-types';
export declare class AuthorizeHandler {
    options: any;
    allowEmptyState: boolean;
    authenticateHandler: any;
    model: Model;
    constructor(options?: any);
    handle(request: Request, response: Response): Promise<any>;
    getClient(request: Request): Promise<Client>;
    validateScope(user: User, client: Client, scope: string): Promise<string>;
    getScope(request: Request): any;
    getState(request: Request): any;
    getUser(request: Request, response: Response): Promise<any>;
    getRedirectUri(request: Request, client: Client): any;
    getResponseType(request: Request, client: Client): any;
    buildSuccessRedirectUri(redirectUri: string, responseType: CodeResponseType | TokenResponseType): any;
    buildErrorRedirectUri(redirectUri: any, responseType: CodeResponseType | TokenResponseType, error: Error): url.UrlWithParsedQuery;
    updateResponse(response: Response, redirectUri: any, responseType: CodeResponseType | TokenResponseType, state: any): void;
}
