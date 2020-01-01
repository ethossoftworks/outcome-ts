export declare namespace Outcome {
    function val<T>(value: T): OutcomeValue<T>;
    function err(error: unknown): OutcomeError;
    function wrap<T>(promise: Promise<T>): Promise<Outcome<T>>;
}
declare class OutcomeError {
    error: unknown;
    constructor(error: unknown);
    isError(): this is OutcomeError;
}
declare class OutcomeValue<T> {
    value: T;
    constructor(value: T);
    isError(): this is OutcomeError;
}
export declare type Outcome<T> = OutcomeValue<T> | OutcomeError;
export {};
