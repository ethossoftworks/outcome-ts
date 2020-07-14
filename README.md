# Outcome

An alternative approach to async/await error handling for TypeScript

* [Build](#build)
* [Usage](#usage)
* [Motivation](#motivation)
* [Design](#design)

# Build

```bash
git clone https://github.com/ethossoftworks/outcome-ts.git
cd outcome-ts
yarn                 # or npm install
yarn build           # or npm run build

# yarn test          # Run testing script
# yarn test-inspect  # Run testing script with chrome dev-tools inspector
```

# Usage

Outcome works best (while not required) with the following TypeScript compiler option:

```
"strictNullChecks": true
```

Using `strictNullChecks` will prevent the Outcome value from being set to null or undefined unless the user-specified Outcome type supports it.

## Add to Project
```bash
npm install @ethossoftworks/outcome
# or
yarn add @ethossoftworks/outcome
```

## Create a Standard Outcome
```typescript
import { Outcome } from "@ethossoftworks/outcome"

async function foo(): Promise<Outcome<User>> {
    // Do some things

    if (success) {
        return Outcome.val(myValue)
    }

    return Outcome.err("Foo bar")
}
```

## Consume an Outcome
```typescript
import { Outcome } from "@ethossoftworks/outcome"

const fooResult = await foo()
if (fooResult.isError()) {
    console.warn("There was a problem:", fooResult.error)
    return
}

// Type inference allows type-safe compile time use of the value
console.log(fooResult.value)
```

## Wrap an Existing Promise With an Outcome
```typescript
import { Outcome } from "@ethossoftworks/outcome"

function promiseFunction(): Promise<string> {
    return new Promise((resolve, reject) => {
        resolve("It worked")
    })
}

const wrappedResult = await Outcome.wrap(promiseFunction())
if (wrappedResult.isError()) {
    console.warn("There was a problem:", wrappedResult.error)
    return
}

// Type inference allows type-safe compile time use of the value
console.log(wrappedResult.value)
```

## Wrap Try/Catch With an Outcome
```typescript
import { Outcome } from "@ethossoftworks/outcome"

async function myApiRequest(): Promise<Outcome<ApiResponse>> {
    return Outcome.try(async () => {
        const response = await fetch('http://example.com/movies.json')
        const json = response.json()
        return ApiResponse(json)
    })
}

const result = await myApiRequest()

if (result.isError()) {
    console.warn("There was a problem:", result.error)
    return
}

// Type inference allows type-safe compile time use of the value
console.log(result.value)
```

## Usage With a Defined Error Type

```typescript
import { Outcome } from "@ethossoftworks/outcome"

enum UserError {
    EmailNotFound = 0,
    InvalidPassword
}

async function login(): Promise<Outcome<User, UserError>> {
    // Do some things

    if (success) {
        return Outcome.val(user)
    }

    return Outcome.err(UserError.InvalidPassword)
}

function assertUnreachable(x: never): never {
    throw new Error()
}

const userResult = await login()
if (userResult.isError()) {
    switch (userResult.error) {
        case UserError.EmailNotFound:
            console.warn("Email not found")
            break
        case UserError.InvalidPassword:
            console.warn("Invalid password")
            break
        default:
            // This Guarantees an exhaustive case check
            assertUnreachable(userResult.error)
            break
    }
    return
}

// Type inference allows type-safe compile time use of the value
console.log(userResult.value)
```

# Motivation

Promises and Async/Await are wonderful, flexible APIs that provide a great developer experience. However, promises and async/await have some undesirable syntax when dealing with complex error handling.

## Promise Issues
-   Promise callbacks can make logic branching more difficult and more confusing to reason about while handling all errors appropriately.
- Promises in TypeScript do not have error types associated with them.

    For example:
    ```typescript
    function foo(): Promise<Bar> {
        return new Promise((resolve, reject) => {
            resolve(new Bar())
        })
    }

    function foo2(): Promise<Bar> {
        return new Promise((resolve, reject) => {
            resolve(new Bar())
        })
    }

    function main() {
        let bar = null
        let bar2 = null

        foo().then(val => {
            // Bar must be a `let` variable or must be passed along to foo2()
            bar = val
            return foo2()
        }).then(val => {
            bar2 = val

            console.log(bar, bar2)
        }).catch(e => {
            // Can only single error handler when using sequential promises

            // e is an Exception, which requires more type checking before handling the error
        })
    }
    ```

    Becomes:
    ```typescript
    async function foo(): Promise<Outcome<Bar, FooError>> {
        return Outcome.val(new Bar())
    }

    async function foo2(): Promise<Outcome<Bar, Foo2Error>> {
        return Outcome.val(new Bar())
    }

    function main() {
        const bar = await foo()
        if (bar.isError()) {
            // Handle individual error
            return
        }

        const bar2 = await foo2()
        if (bar.isError()) {
            // Handle individual error
            return
        }

        // Access to both foo and foo2 values at the same level
        console.log(bar.value, bar2.value)
    }
    ```

## Async/Await Issues
-   Using Async/Await safely necessitates the use try/catch blocks to handle errors
-   To use a value outside of the try/catch block, a user must define a `let` instead of a `const` outside of the try/catch block. This is not guaranteed to be safe at compile time and type inference is iffy.
-   Using `const`, the resultant value can only be used within the try block which may prevent clean handling of additional errors when using the resultant value. In addition, another level of indentation is undesirable.
-   Often errors in an application are not exceptional and it should not be necessary to treat them as exceptions.
- All errors are exception and have no helpful type association.

    For example:
    ```typescript
    async function foo(): Promise<Bar> {
        return new Bar()
    }

    async function foo2(bar: Bar): Promise<boolean> {
        // Some task requiring bar
        return true
    }

    function main() {
        try {
            // Anything we want to do with foo must happen in this try/catch block
            const bar = await foo()
            const bar2 = await foo2(bar)

            console.log(bar, bar2)
        } catch(e) {
            // e is an Exception, which requires more type checking before handling the error

            // Either we handle both errors in a single catch, move into another level of try/catch,
            // or handle additional errors with another mechanism (separate function, .etc)
        }
    }
    ```

    Becomes:
    ```typescript
    async function foo(): Promise<Outcome<Bar, FooError>> {
        return Outcome.val(new Bar())
    }

    async function foo2(bar: Bar): Promise<Outcome<boolean, Foo2Error>> {
        // Some task requiring bar
        return Outcome.val(true)
    }

    function main() {
        const bar = await foo()
        if (bar.isError()) {
            // Handle individual error
            return
        }

        const bar2 = await foo2(bar)
        if (bar2.isError()) {
            // Handle individual error
            return
        }

        console.log(bar.value, bar2.value)
    }
    ```

[Golang](https://golang.org) uses the concept of [errors as values](https://blog.golang.org/errors-are-values) which allows for checking for errors and handling them without requiring another block indentation. This also allows easier handling of complex error branches.

The downside of how Golang handles errors is that it does not enforce handling errors at compile time which can lead to the Golang equivalent of null pointer exceptions.

`Outcome` strives to provide type-safe error handling without the syntactic bloat of try/catches or callbacks.


# Design

The goal of Outcome is to allow for clean, complex branching based on success or failure of operations (whether asynchronous or not). This is achieved through type guards (which allow for compile time type inference) and forcing the checking of success/failure before working with the corresponding value. Outcome is also designed to allow for specified error types to allow for cleaner APIs where users can know ahead-of-time all of the different errors that a particular function can return.

`Outcome<T, E>` is a [union type](https://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types) of an `OutcomeValue<T>` and an `OutcomeError<E>` type. The `value` and `error` properties of those respective types are only accessible after a type check on the `Outcome`.

`OutcomeError` is by default an `unknown` type which enforces type checking to handle any error. This prevents changes to error types causing unknown problems down the road. An error type may be specified to enforce only returning specific types of errors for a giving `Outcome`.

`isError()` is a TypeScript [type guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards) that allows for compile-time type inference.

Any existing promise can be converted to an `Outcome` with the provided helper function `Outcome.wrap()`. Since promises do not have error types, wrapping promises will use the `unknown` type for the error value.
