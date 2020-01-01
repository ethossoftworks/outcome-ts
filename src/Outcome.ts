export namespace Outcome {
    export function val<T>(value: T): OutcomeValue<T> {
        return new OutcomeValue(value)
    }

    export function err(error: unknown): OutcomeError {
        return new OutcomeError(error)
    }

    export async function wrap<T>(promise: Promise<T>): Promise<Outcome<T>> {
        try {
            return new OutcomeValue(await promise)
        } catch (e) {
            return new OutcomeError(e)
        }
    }
}

class OutcomeError {
    constructor(public error: unknown) {}

    isError(): this is OutcomeError {
        return true
    }
}

class OutcomeValue<T> {
    constructor(public value: T) {}

    isError(): this is OutcomeError {
        return false
    }
}

export type Outcome<T> = OutcomeValue<T> | OutcomeError
