import { OAuthError } from './oauth-error';
export declare class UnsupportedGrantTypeError extends OAuthError {
    constructor(message?: string | Error, properties?: any);
}
