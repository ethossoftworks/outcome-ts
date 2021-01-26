import { runTests, assert, fail, test } from "@ethossoftworks/knock-on-wood"
import { Outcome, Error as OutcomeError } from "./Outcome"

const Tests = () => {
    test("testError", async () => {
        const result = await generateOutcome(null, false)
        assert(result.isError() && result.error === false)
    })
    test("testErrorWithType", async () => {
        const result = await generateTypedOutcome(null, TestError.TestError2)
        if (result.isError()) {
            switch (result.error) {
                case TestError.TestError1:
                    fail()
                    return
                case TestError.TestError2:
                    return
                default:
                    fail()
                    assertUnreachable(result.error)
            }
        }
        fail()
    })
    test("testOk", async () => {
        const result = await generateOutcome("It worked!")
        assert(!result.isError() && result.value === "It worked!")
    })
    test("testIsOk", async () => {
        const error = Outcome.error("Error")
        const ok = Outcome.ok("Ok")
        assert(!error.isOk())
        assert(ok.isOk())
    })
    test("testWrapSuccess", async () => {
        const result = await Outcome.wrap(generatePromise(true))
        assert(!result.isError() && result.value == "OK")
    })
    test("testWrapError", async () => {
        const result = await Outcome.wrap(generatePromise(false))
        assert(result.isError() && result.error == "Error")
    })
    test("testTry", async () => {
        const try1 = async () => {
            return (null as any).test()
        }

        const try2 = async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            return 1
        }

        const result1 = await Outcome.try(try1)
        assert(result1.isError())

        const result2 = await Outcome.try(try2)
        assert(!result2.isError() && result2.value === 1)
    })
    test("testIsOutcome", async () => {
        const notOutcome: any = {}
        const outcomeOk: any = Outcome.ok(1)
        const outcomeError: any = Outcome.error("error")

        assert(!Outcome.isOutcome(undefined))
        assert(!Outcome.isOutcome(notOutcome))
        assert(Outcome.isOutcome(outcomeOk))
        assert(Outcome.isOutcome(outcomeError))
    })
    test("Custom TypeGuard", async () => {
        const outcome1: Outcome<unknown> = Outcome.ok(1)
        const outcome2: Outcome<unknown> = Outcome.error("hello")
        const outcome3: Outcome<unknown> = Outcome.error({ TestError1: 1, TestError2: 3 })

        assert(!isTestError(outcome1), "Outcome.Ok<number> passed the check")
        assert(!isTestError(outcome2), "Outcome.Error<string> passed the check")
        assert(isTestError(outcome3), "Outcome.Error<number> did not pass the check")
    })
}

enum TestError {
    TestError1 = 0,
    TestError2 = 1,
}

type TestErrorType = {
    TestError1: number
    TestError2: number
}

function isTestError(outcome: Outcome<any>): outcome is OutcomeError<TestErrorType> {
    return (
        outcome.isError() &&
        typeof outcome.error === "object" &&
        (outcome.error as any).TestError1 !== undefined &&
        (outcome.error as any).TestError2 !== undefined
    )
}

function generateOutcome<T>(successVal: T | null = null, errorVal: unknown = null): Promise<Outcome<T>> {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (successVal !== null) {
                resolve(Outcome.ok(successVal))
            } else if (errorVal !== null) {
                resolve(Outcome.error(errorVal))
            }
        }, 100)
    })
}

function generateTypedOutcome<T, E>(successVal: T | null = null, errorVal: E | null = null): Promise<Outcome<T, E>> {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (successVal !== null) {
                resolve(Outcome.ok(successVal))
            } else if (errorVal !== null) {
                resolve(Outcome.error(errorVal))
            }
        }, 100)
    })
}

function assertUnreachable(x: never): never {
    throw new Error()
}

function generatePromise(success: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (success) {
                resolve("OK")
            } else {
                reject("Error")
            }
        }, 100)
    })
}

runTests({ Outcome: Tests })
