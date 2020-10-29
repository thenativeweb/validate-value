import { JSONSchema7 } from 'json-schema';

const invalid: JSONSchema7 = {
  type: 'string',
  format: 'invalid-format'
};

export { invalid };
