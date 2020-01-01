import { Outcome } from "./Outcome"

enum TestError {
    TestError1 = 0,
    TestError2
}

function assertUnreachable(x: never): never {
    throw new Error()
}

async function main() {
    const result1 = await Outcome.wrap(testPromise())
    if (result1.isError()) {
        console.warn(result1.error)
        return
    }
    console.log(result1.value)

    const result2 = await Outcome.wrap(testBadPromise())
    if (result2.isError()) {
        console.warn(result2.error)
    } else {
        console.log(result2.value)
    }

    const result3 = await test()
    if (result3.isError()) {
        console.warn(result3.error)
    } else {
        console.log(result3.value)
    }

    const result4 = await testWithErrorType()
    if (result4.isError()) {
        console.warn(result4.error + 2)
    } else {
        console.log(result4.value)
    }

    const result5 = await testWithErrorType2()
    if (result5.isError()) {
        switch (result5.error) {
            case TestError.TestError1:
                console.warn("TestError 1")
                break
            case TestError.TestError2:
                console.warn("TestError 2")
                break
            default:
                assertUnreachable(result5.error)
        }
    }
}

function testPromise(): Promise<string> {
    return new Promise((resolve, reject) => {
        setTimeout(resolve.bind(null, "Good Promise"), 500)
    })
}

function testBadPromise(): Promise<string> {
    return new Promise((resolve, reject) => {
        setTimeout(reject.bind(null, "Bad Promise"), 500)
    })
}

async function test(): Promise<Outcome<string>> {
    if (Math.round(Math.random()) === 1) {
        return Outcome.err("Random: Error")
    }
    return Outcome.val("Random: Success")
}

async function testWithErrorType(): Promise<Outcome<string, number>> {
    if (Math.round(Math.random()) === 1) {
        return Outcome.err(2)
    }
    return Outcome.val("Random: Success")
}

async function testWithErrorType2(): Promise<Outcome<string, TestError>> {
    return Outcome.err(TestError.TestError2)
}

main()
