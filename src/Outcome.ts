const outcomeSymbol = Symbol()

export class Ok<T, E = unknown> {
    private outcomeSymbol = outcomeSymbol

    constructor(public value: T) {}

    isError(): this is Error<T, E> {
        return false
    }

    isOk(): this is Ok<T, E> {
        return true
    }

    runOnOk(block: (value: T) => void) {
        block(this.value)
    }

    runOnError(block: (error: E) => void) {
        // Noop
    }

    unwrapOrDefault(defaultValue: T): T {
        return this.value
    }

    unwrapOrNull(): T | null {
        return this.value
    }
}

export class Error<T, E = unknown> {
    private outcomeSymbol = outcomeSymbol

    constructor(public error: E) {}

    isError(): this is Error<T, E> {
        return true
    }

    isOk(): this is Ok<T, E> {
        return false
    }

    runOnOk(block: (value: T) => void) {
        // Noop
    }

    runOnError(block: (error: E) => void) {
        block(this.error)
    }

    unwrapOrDefault(defaultValue: T): T {
        return defaultValue
    }

    unwrapOrNull(): T | null {
        return null
    }
}

export const Outcome = {
    ok: <T>(value: T): Outcome<T, never> => new Ok(value),
    error: <E>(error: E): Outcome<never, E> => new Error(error),

    wrap: async <T>(promise: Promise<T>): Promise<Outcome<T>> => {
        try {
            return new Ok(await promise)
        } catch (e) {
            return new Error(e)
        }
    },

    try: async <T>(block: () => Promise<T>): Promise<Outcome<T>> => {
        try {
            return new Ok(await block())
        } catch (e) {
            return new Error(e)
        }
    },

    isOutcome: (other: any): other is Outcome<any> => {
        return other !== undefined && other.outcomeSymbol === outcomeSymbol
    },
}

export type Outcome<T, E = unknown> = Ok<T, E> | Error<T, E>
