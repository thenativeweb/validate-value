# validate-value

validate-value validates values against JSON schemas.

## Status

| Category         | Status                                                                                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version          | [![npm](https://img.shields.io/npm/v/validate-value)](https://www.npmjs.com/package/validate-value)                                                      |
| Dependencies     | ![David](https://img.shields.io/david/thenativeweb/validate-value)                                                                                       |
| Dev dependencies | ![David](https://img.shields.io/david/dev/thenativeweb/validate-value)                                                                                   |
| Build            | [![CircleCI](https://img.shields.io/circleci/build/github/thenativeweb/validate-value)](https://circleci.com/gh/thenativeweb/validate-value/tree/master) |
| License          | ![GitHub](https://img.shields.io/github/license/thenativeweb/validate-value)                                                                             |

## Installation

```shell
$ npm install validate-value
```

## Quick start

First you need to integrate validate-value into your application:

```javascript
const Value = require('validate-value').default;
```

If you use TypeScript, use the following code instead:

```typescript
import Value from 'validate-value';
```

Then, create a new instance and provide a [JSON schema](https://json-schema.org/learn/getting-started-step-by-step.html) that you would like to use for validation:

```javascript
const value = new Value({
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' }
  },
  additionalProperties: false,
  required: [ 'username', 'password' ]
});
```

Afterwards, you may use the `validate` function to validate a value:

```javascript
const user = {
  username: 'Jane Doe',
  password: 'secret'
};

try {
  value.validate(user);
} catch (ex) {
  // ...
}
```

By default, the error message uses `value` as identifier and `.` as the separator for the object that is validated, but sometimes you may want to change this. Therefor, provide the desired identifier and separator as second parameter to the `validate` function:

```javascript
const user = {
  username: 'Jane Doe',
  password: 'secret'
};

try {
  value.validate(user, { valueName: 'person', separator: '/' });
} catch (ex) {
  // ...
}
```

From time to time, you may not be interested in the actual error, but only in the fact whether the given object is valid or not. For these cases, use the `isValid` function:

```javascript
const user = {
  username: 'Jane Doe',
  password: 'secret'
};

console.log(value.isValid(user));
// => true
```

## Running the build

To build this module use [roboter](https://www.npmjs.com/package/roboter).

```shell
$ npx roboter
```
