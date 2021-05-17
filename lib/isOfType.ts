import { JSONSchema7 } from 'json-schema';
import { Parser } from './Parser';

const isOfType = function <T>(
  data: unknown,
  schema: JSONSchema7
): data is T {
  const parser = new Parser(schema);

  return parser.isValid(data);
};

export {
  isOfType
};
