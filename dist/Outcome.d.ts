export declare namespace Outcome {
    function val<T>(value: T): OutcomeValue<T>;
    function err<T>(error: T): OutcomeError<T>;
    function wrap<T>(promise: Promise<T>): Promise<Outcome<T>>;
}
declare class OutcomeError<T = unknown> {
    error: T;
    constructor(error: T);
    isError(): this is OutcomeError;
}
declare class OutcomeValue<T> {
    value: T;
    constructor(value: T);
    isError(): this is OutcomeError;
}
export declare type Outcome<T, E = unknown> = OutcomeValue<T> | OutcomeError<E>;
export {};
