import { OAuthError } from './oauth-error';
export declare class InvalidTokenError extends OAuthError {
    constructor(message?: string | Error, properties?: any);
}
