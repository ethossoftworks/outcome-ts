export type TestGroup<T> = {
    context: T
    tests: { [testName: string]: Test<T> }
    label?: string
    beforeEach?: (context: T) => void
    afterEach?: (context: T) => void
    beforeAll?: (context: T) => void
    afterAll?: (context: T) => void
}

export type Test<T> = (t: TestContainer<T>) => Promise<void>

type TestContainer<T> = {
    context: T
    fail(reason?: string): void
    assert(condition: boolean, failureMessage?: string): void
}

type TestResult = {
    failed: boolean
    reason?: string
}

export async function runTests<T>(...testGroups: TestGroup<T>[]) {
    let totalTestCount: number = 0
    let totalPassedCount: number = 0

    for (let i = 0; i < testGroups.length; i++) {
        const group: TestGroup<unknown> = testGroups[i]
        const singleTests: string[] = Object.getOwnPropertyNames(group.tests).filter(testName => {
            return testName.indexOf("_") === 0
        })
        const testNames: string[] = singleTests.length > 0 ? singleTests : Object.getOwnPropertyNames(group.tests)
        const testContext = group.context
        let passedCount: number = 0
        totalTestCount += testNames.length

        console.group(`Running Group (${i + 1} of ${testGroups.length})${group.label ? ": " + group.label : ""}`)
        group.beforeAll?.(testContext)

        for (let j = 0; j < testNames.length; j++) {
            group.beforeEach?.(testContext)
            const testName = testNames[j]
            const testFunc = group.tests[testName]
            const testResult: TestResult = { failed: false }
            const testContainer = createTestContainer(testContext, testResult)

            try {
                console.groupCollapsed(`Running Test (${j + 1} of ${testNames.length}): ${testName}`)
                await testFunc(testContainer)

                if (!testResult.failed) {
                    passedCount++
                    totalPassedCount++
                    console.groupEnd()
                    console.log(fmt(`\u2713 Passed:  ${testName}`, Text.green))
                } else {
                    handleFailedTest(testName, testResult.reason)
                }
            } catch (e) {
                handleFailedTest(testName, e)
            }
            group.afterEach?.(testContext)
        }

        group.afterAll?.(testContext)
        console.groupEnd()
        console.log(
            fmt(
                `Finished tests: ${passedCount} of ${testNames.length} passed`,
                passedCount === testNames.length ? Text.green : Text.red
            )
        )
    }

    console.log(
        fmt(
            `\nFinished all test groups: ${totalPassedCount} of ${totalTestCount} passed`,
            totalPassedCount === totalTestCount ? Text.green : Text.red,
            Text.bold,
            Text.inverse
        )
    )
}

function handleFailedTest(testName: string, reason?: string | Error) {
    console.groupEnd()
    console.groupCollapsed(fmt(`\u2717 Failed:  ${testName}`, Text.red))
    if (reason) {
        console.log(reason)
    }
    console.groupEnd()
}

function createTestContainer<T>(context: T, result: TestResult): TestContainer<T> {
    return {
        context: context,
        fail: (reason?: string) => {
            result.failed = true
            result.reason = reason
        },
        assert: (condition, failureMessage) => {
            if (!condition) {
                result.failed = true
                result.reason = failureMessage
            }
        }
    }
}

enum Text {
    green = `\x1b[32m`,
    red = `\x1b[31m`,
    bold = `\x1b[1m`,
    underline = `\x1b[4m`,
    inverse = `\x1b[7m`
}

function fmt(message: string, ...formatters: Text[]): string {
    return `${formatters.join("")}${message}\x1b[0m`
}
