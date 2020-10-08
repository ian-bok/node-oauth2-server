import { AbstractGrantType } from '.';
import { Client, Token, User } from '../interfaces';
import { Request } from '../request';
export declare class ClientCredentialsGrantType extends AbstractGrantType {
    constructor(options?: any);
    handle(request: Request, client: Client): Promise<Token>;
    getUserFromClient(client: Client): Promise<User>;
    saveToken(user: User, client: Client, scope: string): Promise<Token>;
}
