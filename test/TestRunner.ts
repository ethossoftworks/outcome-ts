export type TestGroup<T> = {
	context: T
	tests: { [key: string]: Test<T> }
}

export type Test<T> = (context: T) => Promise<any>

export class TestRunner {
	static async run<T>(preTestGroupSetup: ((context: T) => void) | null = null, ...testGroups: TestGroup<T>[]) {
		let totalTestCount: number = 0
		let totalPassedCount: number = 0

		for (let i = 0; i < testGroups.length; i++) {
			const group: TestGroup<T> = testGroups[i]
			const singleTests: string[] = Object.getOwnPropertyNames(group.tests).filter(testName => {
				return testName.indexOf("_") === 0
			})
			const testNames: string[] = singleTests.length > 0 ? singleTests : Object.getOwnPropertyNames(group.tests)
			const context = testGroups[i].context
			let passedCount: number = 0
			totalTestCount += testNames.length

			console.group(`Running Group (${i + 1} of ${testGroups.length})`)
			preTestGroupSetup?.(context)

			for (let j = 0; j < testNames.length; j++) {
				const testName = testNames[j]
				const test = group.tests[testName]

				try {
					console.groupCollapsed(`Running Test (${j + 1} of ${testNames.length}): ${testName}`)
					await test(context)
					passedCount++
					totalPassedCount++
					console.groupEnd()
					console.log(`%cPassed:  ${testName}`, "color: green")
				} catch (e) {
					console.groupEnd()
					console.groupCollapsed(`%cFailed:  ${testName}`, "color: red")
					console.log(e)
					console.groupEnd()
				}
			}

			const color = passedCount === testNames.length ? "color: green" : "color: red"
			console.groupEnd()
			console.log(`%cFinished tests: ${passedCount} of ${testNames.length} passed`, color)
		}

		const color = totalPassedCount === totalTestCount ? "color: green" : "color: red"
		console.log(
			`%c\nFinished all test groups: ${totalPassedCount} of ${totalTestCount} passed`,
			`font-weight: 700; ${color}`
		)
	}
}

export function assert(condition: boolean): boolean {
	if (!condition) {
		throw "Test failed"
	}
	return condition
}
