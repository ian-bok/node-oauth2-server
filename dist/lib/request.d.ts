export declare class Request {
    body: any;
    headers: any;
    method: string;
    query: any;
    constructor(options?: {
        body: any;
        headers: any;
        method: string;
        query: any;
        [key: string]: any;
    });
    get(field: string): any;
    is(args: string[]): string | false;
    is(...args: string[]): string | false;
}
