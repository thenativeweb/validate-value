import { JSONSchema7 } from 'json-schema';
import { Value } from './Value';

const isOfType = function <T>(data: unknown, schema: JSONSchema7): data is T {
  const value = new Value(schema);

  return value.isValid(data);
};

export { isOfType };
