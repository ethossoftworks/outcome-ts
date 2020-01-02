# Outcome (TypeScript)

An alternative approach to async/await error handling for TypeScript

# Motivation

Promises and Async/Await are wonderful, flexible APIs that provide a great developer experience. However, promises and async/await have some undesirable syntax when dealing with complex error handling.

-   Promises and their callbacks can make logic branching more difficult and more confusing to reason about while handling all errors appropriately.
-   Async/Await uses try/catch syntax to handle errors which has a couple of problems syntactically:
    -   A user must define a `let` instead of a `const` outside of the try catch in order to use the resultant value outside of the try/catch. This is not guaranteed to be safe at compile time and type inference is iffy.
    -   Using `const`, the resultant value can only be used within the try block which may prevent clean handling of additional errors when using the resultant value. In addition, another level of indentation is undesirable.
    -   Often errors in an application are not exceptional and it is not necessary to treat them as exceptions.

Golang uses the concept of [errors as values](https://blog.golang.org/errors-are-values) which allows for checking for errors and handling them without adding another block indentation. This also allows easier handling of complex error branches.

The downside of how Golang handles errors is that it does not enforce handling errors at compile time which can lead to the Golang equivalent of null pointer exceptions.

`Outcome` strives to provide type-safe error handling without the syntactic bloat of try/catches or callbacks.

# Design

The goal of Outcome is to allow for clean, complex branching based on success or failure of operations (whether asynchronous or not). This is achieved through type guards (which allow for compile time type inference) and forcing the checking of success/failure before working with the corresponding value. Outcome is also designed to allow for specified error types to allow for cleaner APIs where users can know ahead of time all of the different errors that a particular call can return.

`Outcome<T>` is a [union type](https://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types) of an `OutcomeValue<T>` and an `OutcomeError<E>` type. The `value` and `error` properties of those respective types are only accessible after a type check on the `Outcome`.

`OutcomeError` is by default an [`unknown`] type which enforces type checking to handle any error. This prevents changes to error types causing unknown problems down the road. An error type may be specified to enforce only returning specific types of errors for a giving `Outcome`.

`isError()` is a TypeScript type guard that allows for compile-time type inference.

Any existing promise can be converted to an `Outcome` with the provided helper function `Outcome.wrap()`. Since promises do not have error types, wrapping promises will simply use the `unknown` type for the error value.

# Build

```bash
git clone https://github.com/ryanmitchener/outcome-ts.git
cd outcome-ts
yarn          # or npm install
yarn build    # or npm run build
```

# Usage

Outcome works best with the following TypeScript compiler option (but it is not necessary):

```
"strictNullChecks": true
```

Using `strictNullChecks` will prevent the Outcome value from being set to null or undefined unless the provided Outcome type supports it.

## Basic Usage

```typescript
async function login(): Promise<Outcome<User>> {
    // Do some things

    if (success) {
        return Outcome.val(user)
    }

    return Outcome.err("User not logged in")
}

function main() {
    const userResult = await login()
    if (userResult.isError()) {
        console.warn("There was a problem")
        return
    }

    // Type inference allows type-safe compile time use of the value
    console.log(userResult.value)
}
```

## Usage With a Defined Error Type

```typescript
// This could also be a complex union type
enum UserError {
    EmailNotFound = 0,
    InvalidPassword
}

function assertUnreachable(x: never): never {
    throw new Error()
}

async function login(): Promise<Outcome<User, UserError>> {
    // Do some things

    if (success) {
        return Outcome.val(user)
    }

    return Outcome.err(UserError.InvalidPassword)
}

function main() {
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
    }

    // Type inference allows type-safe compile time use of the value
    console.log(userResult.value)
}
```
