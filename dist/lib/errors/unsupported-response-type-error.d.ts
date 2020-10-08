import { OAuthError } from './oauth-error';
export declare class UnsupportedResponseTypeError extends OAuthError {
    constructor(message?: string | Error, properties?: any);
}
