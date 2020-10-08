import { Client, User } from '.';
export interface RefreshToken {
    refreshToken: string;
    refreshTokenExpiresAt?: Date;
    scope?: string;
    client: Client;
    user: User;
    [key: string]: any;
}
