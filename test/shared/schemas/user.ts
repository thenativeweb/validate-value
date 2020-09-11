import { JSONSchema4 } from 'json-schema';

const user: JSONSchema4 = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' }
  },
  required: [ 'username', 'password' ],
  additionalProperties: false
};

export { user };
