import { JSONSchema7 } from 'json-schema';
import { ParseError } from './ParseError';
import { Parser } from './Parser';
import { Result } from 'defekt';

const parse = function <TParsed>(
  unparsedValue: unknown,
  schema: JSONSchema7,
  { valueName = 'value', separator = '.' }: {
    valueName?: string;
    separator?: string;
  } = {}
): Result<TParsed, ParseError> {
  const parser = new Parser<TParsed>(schema);

  return parser.parse(unparsedValue, { valueName, separator });
};

export {
  parse
};
