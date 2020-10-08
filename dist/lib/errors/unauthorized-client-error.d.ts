import { OAuthError } from './oauth-error';
export declare class UnauthorizedClientError extends OAuthError {
    constructor(message?: string | Error, properties?: any);
}
