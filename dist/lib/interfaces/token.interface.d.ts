import { Client, User } from '.';
export interface Token {
    accessToken: string;
    accessTokenExpiresAt?: Date;
    refreshToken?: string;
    refreshTokenExpiresAt?: Date;
    scope?: string;
    client: Client;
    user: User;
    [key: string]: any;
}
