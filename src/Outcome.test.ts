import { Outcome } from "./Outcome"

async function main() {
    const result2 = await Outcome.wrap(testPromise())
    if (result2.isError()) {
        console.warn(result2.error)
        return
    }
    console.log(result2.value)

    const result3 = await Outcome.wrap(testBadPromise())
    if (result3.isError()) {
        console.warn(result3.error)
    } else {
        console.log(result3.value)
    }

    const result1 = await test()
    if (result1.isError()) {
        console.warn(result1.error)
        return
    }
    console.log(result1.value)
}

function testPromise(): Promise<string> {
    return new Promise((resolve, reject) => {
        resolve("Good Promise")
    })
}

function testBadPromise(): Promise<string> {
    return new Promise((resolve, reject) => {
        reject("Bad Promise")
    })
}

async function test(): Promise<Outcome<string>> {
    if (Math.round(Math.random()) === 1) {
        return Outcome.err("Random: Error")
    }
    return Outcome.val("Random: Success")
}

main()
