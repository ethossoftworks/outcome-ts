import { Outcome } from "../src/Outcome"
import { TestRunner, TestGroup, assert, fail, pass } from "./TestRunner"

interface TestContext {}

const testContext: TestContext = {}

const Tests: TestGroup<TestContext> = {
    context: testContext,
    tests: {
        testError: async context => {
            const result = await generateOutcome(null, false)
            assert(result.isError() && result.error === false)
        },
        testErrorWithType: async context => {
            const result = await generateTypedOutcome(null, TestError.TestError2)
            if (result.isError()) {
                switch (result.error) {
                    case TestError.TestError1:
                        fail()
                        return
                    case TestError.TestError2:
                        pass()
                        return
                    default:
                        fail()
                        assertUnreachable(result.error)
                }
            }
            fail()
        },
        testValue: async context => {
            const result = await generateOutcome("It worked!")
            assert(!result.isError() && result.value === "It worked!")
        },
        testWrapSuccess: async context => {
            const result = await Outcome.wrap(generatePromise(true))
            assert(!result.isError() && result.value == "OK")
        },
        testWrapError: async context => {
            const result = await Outcome.wrap(generatePromise(false))
            assert(result.isError() && result.error == "Error")
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
                resolve(Outcome.val(successVal))
            } else if (errorVal !== null) {
                resolve(Outcome.err(errorVal))
            }
        }, 200)
    })
}

function generateTypedOutcome<T, E>(successVal: T | null = null, errorVal: E | null = null): Promise<Outcome<T, E>> {
    return new Promise(resolve => {
        setTimeout(() => {
            if (successVal !== null) {
                resolve(Outcome.val(successVal))
            } else if (errorVal !== null) {
                resolve(Outcome.err(errorVal))
            }
        }, 200)
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
        }, 200)
    })
}

TestRunner.run(Tests)
