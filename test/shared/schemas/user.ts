import { JSONSchema7 } from 'json-schema';

const user: JSONSchema7 = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' }
  },
  required: [ 'username', 'password' ],
  additionalProperties: false
};

export { user };
