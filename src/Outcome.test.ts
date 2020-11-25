import { TestGroup, runTests } from "@ethossoftworks/knock-on-wood"
import { Outcome } from "./Outcome"

const testContext = {}

const Tests: TestGroup<typeof testContext> = {
    context: testContext,
    tests: {
        testError: async ({ assert }) => {
            const result = await generateOutcome(null, false)
            assert(result.isError() && result.error === false)
        },
        testErrorWithType: async ({ fail }) => {
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
        },
        testOk: async ({ assert }) => {
            const result = await generateOutcome("It worked!")
            assert(!result.isError() && result.value === "It worked!")
        },
        testIsOk: async ({ assert }) => {
            const error = Outcome.error("Error")
            const ok = Outcome.ok("Ok")
            assert(!error.isOk())
            assert(ok.isOk())
        },
        testWrapSuccess: async ({ assert }) => {
            const result = await Outcome.wrap(generatePromise(true))
            assert(!result.isError() && result.value == "OK")
        },
        testWrapError: async ({ assert }) => {
            const result = await Outcome.wrap(generatePromise(false))
            assert(result.isError() && result.error == "Error")
        },
        testTry: async ({ assert }) => {
            const try1 = async () => {
                return (null as any).test()
            }

            const try2 = async () => {
                await new Promise(resolve => setTimeout(resolve, 1000))
                return 1
            }

            const result1 = await Outcome.try(try1)
            assert(result1.isError())

            const result2 = await Outcome.try(try2)
            assert(!result2.isError() && result2.value === 1)
        },
        testIsOutcome: async ({ assert }) => {
            const notOutcome: any = {}
            const outcomeOk: any = Outcome.ok(1)
            const outcomeError: any = Outcome.error("error")

            assert(!Outcome.isOutcome(undefined))
            assert(!Outcome.isOutcome(notOutcome))
            assert(Outcome.isOutcome(outcomeOk))
            assert(Outcome.isOutcome(outcomeError))
        }
    }
}

enum TestError {
    TestError1 = 0,
    TestError2 = 1
}

function generateOutcome<T>(successVal: T | null = null, errorVal: unknown = null): Promise<Outcome<T>> {
    return new Promise(resolve => {
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
    return new Promise(resolve => {
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

runTests(Tests)
