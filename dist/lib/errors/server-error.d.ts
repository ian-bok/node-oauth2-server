import { OAuthError } from './oauth-error';
export declare class ServerError extends OAuthError {
    constructor(message?: string | Error, properties?: any);
}
