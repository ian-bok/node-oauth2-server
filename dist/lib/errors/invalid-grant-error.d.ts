import { OAuthError } from './oauth-error';
export declare class InvalidGrantError extends OAuthError {
    constructor(message?: string | Error, properties?: any);
}
