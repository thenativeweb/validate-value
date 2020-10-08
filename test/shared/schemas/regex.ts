import { JSONSchema4 } from 'json-schema';

const regex: JSONSchema4 = {
  type: 'object',
  properties: {
    value: {
      type: 'string',
      pattern: '0[1-9]+'
    }
  },
  required: [ 'value' ],
  additionalProperties: false
};

export { regex };
