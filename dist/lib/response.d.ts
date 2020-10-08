export declare class Response {
    body: any;
    headers: any;
    status: number;
    constructor(options?: any);
    get(field: string): any;
    redirect(url: string): void;
    set(field: string, value: string): void;
}
