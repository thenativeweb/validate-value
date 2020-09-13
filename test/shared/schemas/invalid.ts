import { JSONSchema4 } from 'json-schema';

const invalid: JSONSchema4 = {
  type: 'string',
  format: 'invalid-format'
};

export { invalid };
