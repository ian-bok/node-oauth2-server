export interface Client {
    id: string;
    redirectUris?: string | string[];
    grants: string | string[];
    accessTokenLifetime?: number;
    refreshTokenLifetime?: number;
    [key: string]: any;
}
