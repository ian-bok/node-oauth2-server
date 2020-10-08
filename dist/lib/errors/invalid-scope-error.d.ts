import { OAuthError } from './oauth-error';
export declare class InvalidScopeError extends OAuthError {
    constructor(message?: string | Error, properties?: any);
}
