import { Request } from './request';
import { Response } from './response';
export declare class OAuth2Server {
    options: any;
    constructor(options?: any);
    authenticate(request: Request, response?: Response, scope?: string): Promise<any>;
    authenticate(request: Request, response?: Response, options?: any): Promise<any>;
    authorize(request: Request, response: Response, options?: any): Promise<any>;
    token(request: Request, response: Response, options?: any): Promise<any>;
    revoke(request: Request, response: Response, options: any): Promise<true>;
}
