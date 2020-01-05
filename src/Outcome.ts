export const Outcome = {
    val: <T>(value: T): OutcomeValue<T> => {
        return new OutcomeValue(value)
    },

    err: <T>(error: T): OutcomeError<T> => {
        return new OutcomeError(error)
    },

    wrap: async <T>(promise: Promise<T>): Promise<Outcome<T>> => {
        try {
            return new OutcomeValue(await promise)
        } catch (e) {
            return new OutcomeError(e)
        }
    }
}

class OutcomeError<T = unknown> {
    constructor(public error: T) {}

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

export type Outcome<T, E = unknown> = OutcomeValue<T> | OutcomeError<E>
