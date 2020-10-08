import { AbstractGrantType } from '.';
import { Client, Token, User } from '../interfaces';
import { Request } from '../request';
export declare class PasswordGrantType extends AbstractGrantType {
    constructor(options?: any);
    handle(request: any, client: any): Promise<Token>;
    getUser(request: Request): Promise<User>;
    saveToken(user: User, client: Client, scope: string): Promise<Token>;
}
