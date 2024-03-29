# validate-value

validate-value validates values against JSON schemas.

## Status

| Category         | Status                                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| Version          | [![npm](https://img.shields.io/npm/v/validate-value)](https://www.npmjs.com/package/validate-value)         |
| Build            | ![GitHub Actions](https://github.com/thenativeweb/validate-value/workflows/Release/badge.svg?branch=main)   |
| License          | ![GitHub](https://img.shields.io/github/license/thenativeweb/validate-value)                                |

## Installation

```shell
$ npm install validate-value
```

## Philosophy

The rewrite of `validate-value` in version 9.0.0 follows the infamous quote "parse, don't validate"<sup>[1](#footnote-1)</sup>. The quote asserts that parsing data is more valuable than validating it. This is very obvious when comparing the two approaches in TypeScript:

```typescript
const doThingsWithValidation = async function (options: unknown): Promise<void> {
  // This throws, if the options are not valid.
  validateOptions(options);

  const typedOptions = options as Options;

  doSomethingWithAnOption(typedOptions.someOption);
};

const doThingsWithParsing = async function (options: unknown): Promise<Result<void, Error>> {
  // This parses the options and unwraps them, throwing if they were invalid.
  // If invalid options were something our program could handle, we would not
  // want to throw here and instead handle the error appropriately.
  // In this example we want the function to throw, if the options are invalid.
  const typedOptions = parseOptions(options).unwrapOrThrow();

  doSomethingWithAnOption(typedOptions.someOption);
};
```

In the second example, the `typedOptions` contained in the `Result` returned from the `parseOptions` call already have the type that we expect them to have and we don't have to assert them or assign them to a new variable in any way. This combines better support from the TypeScript compiler with better error handling from [`defekt`](https://github.com/thenativeweb/defekt/).

## Quick start

First you need to integrate validate-value into your application:

```javascript
const { parse, Parser } = require('validate-value');
```

If you use TypeScript, use the following code instead:

```typescript
import { parse, Parser } from 'validate-value';
```

Then, create a new instance and provide a [JSON schema](https://json-schema.org/learn/getting-started-step-by-step.html) that you would like to use for parsing:

```javascript
const parser = new Parser({
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' }
  },
  additionalProperties: false,
  required: [ 'username', 'password' ]
});
```

If you are using TypeScript, you will want to provide a type for the parsed value:

```typescript
interface User {
  username: string;
  password: string;
}

const parser = new Parser<User>({
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' }
  },
  additionalProperties: false,
  required: [ 'username', 'password' ]
});
```

Afterwards, you may use the `parse` function to parse a value:

```typescript
const user = {
  username: 'Jane Doe',
  password: 'secret'
};

const parseResult = parser.parse(user);

if (parseResult.hasError()) {
  // The user object did not match the parser's schema. This should be handled.
} else {
  // The user object was parsed successfully and the result's value can now be used.
  doSomethingWithUser(parseResult.value);
}
```

After parsing, the value in the returned `Result` will have the type `User`, since it was passed to the parser upon construction.

For details on the error handling in the example above, check the [documentation of the `Result` type in `defekt`](https://github.com/thenativeweb/defekt#using-result).

### Configuring the parser

If you want to, you can configure the parser according to your needs.

#### Configuring the error messages

By default, the error message uses `value` as identifier and `.` as the separator for the object that is parsed, but sometimes you may want to change this. Therefore, provide the desired identifier and separator as second parameter to the `parse` function:

```typescript
const user = {
  username: 'Jane Doe',
  password: 'secret'
};

const parseResult = parser.parse(user, { valueName: 'person', separator: '/' });
```

#### Using a custom validator

Sometimes it is desired to use a custom validator instance, e.g. if you want to add custom formats. For that, you can hand over a custom [Ajv](https://ajv.js.org/) instance to the parser:

```typescript
const schema = // ...
const ajvInstance = new Ajv();

// Adjust Ajv instance according to your needs...

const parser = new Parser<User>(schema, {
  ajvInstance
});
```

Optionally, you can build upon the default instance that is used internally. For that, call the `getDefaultAjvInstance` function:

```typescript
const schema = // ...
const ajvInstance = getDefaultAjvInstance();

// Adjust Ajv instance according to your needs...

const parser = new Parser<User>(schema, {
  ajvInstance
});
```

### Parsing without a parser instance

For convenience, there is also the `parse` function, which skips the creation of a parser instance. You can use this if you're only going to use a schema for validation once. Otherwise, it is recommended to first create a parser instance, since then the JSON schema is only compiled once:

```typescript
import { parse } from 'validate-value';

const parseResult = parse<User>(user, {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' }
  },
  additionalProperties: false,
  required: [ 'username', 'password' ]
});
```

#### Verifying that a variable is of a specific type

To verify that a variable is of a specific type, use the `isOfType` function. Hand over the value you would like to verify, and a JSON schema describing that type. The function returns `true` if the given variable matches the schema, and `false` if it doesn't:

```javascript
const { isOfType } = require('validate-value');

const user = {
  username: 'Jane Doe',
  password: 'secret'
};

const schema = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' }
  },
  additionalProperties: false,
  required: [ 'username', 'password' ]
};

if (isOfType(user, schema)) {
  // ...
}
```

When using TypeScript, you may even specify a generic type parameter, and use the function as a type guard:

```typescript
import { isOfType, JsonSchema } from 'validate-value';

interface User {
  username: string;
  password: string;
}

const user = {
  username: 'Jane Doe',
  password: 'secret'
};

const schema: JsonSchema = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' }
  },
  additionalProperties: false,
  required: [ 'username', 'password' ]
};

if (isOfType<User>(user, schema)) {
  // ...
}
```

## Resources

<a name="footnote-1">1:</a> ["Parse, don't validate", Alexis King, 2019](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/).

## Running quality assurance

To run quality assurance for this module use [roboter](https://www.npmjs.com/package/roboter):

```shell
$ npx roboter
```
