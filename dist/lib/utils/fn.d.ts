export declare const oneSuccess: (promises: Promise<any>[]) => Promise<any>;
export declare const hasOwnProperty: (o: any, k: string) => any;
export declare class AggregateError extends Array implements Error {
    name: string;
    get message(): string;
}
