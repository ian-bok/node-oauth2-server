export declare class BearerTokenType {
    accessToken: string;
    accessTokenLifetime: number;
    refreshToken: string;
    scope: string;
    customAttributes: any;
    constructor(accessToken: string, accessTokenLifetime: number, refreshToken: string, scope: string, customAttributes: any);
    valueOf(): any;
}
