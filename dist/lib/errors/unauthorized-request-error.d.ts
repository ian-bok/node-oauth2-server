import { OAuthError } from './oauth-error';
export declare class UnauthorizedRequestError extends OAuthError {
    constructor(message?: string | Error, properties?: any);
}
