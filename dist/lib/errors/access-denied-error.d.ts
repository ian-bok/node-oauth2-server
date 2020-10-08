import { OAuthError } from './oauth-error';
export declare class AccessDeniedError extends OAuthError {
    constructor(message?: string | Error, properties?: any);
}
