# validate-value

validate-value validates values against JSON schemas.

## Installation

```shell
$ npm install validate-value
```

## Quick start

First you need to integrate validate-value into your application:

```javascript
const Value = require('validate-value');
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

By default, the error message uses `Value` as identifier for the object that is validated, but sometimes you may want to change this. Therefor, provide the desired identifier as second parameter to the `validate` function:

```javascript
const user = {
  username: 'Jane Doe',
  password: 'secret'
};

try {
  value.validate(user, 'Person');
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

## License

The MIT License (MIT)
Copyright (c) 2018 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
