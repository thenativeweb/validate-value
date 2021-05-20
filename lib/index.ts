import { isOfType } from './isOfType';
import { JSONSchema7 as JsonSchema } from 'json-schema';
import { parse } from './parse';
import { ParseError } from './ParseError';
import { Parser } from './Parser';

export type { JsonSchema, ParseError };
export { isOfType, parse, Parser };
