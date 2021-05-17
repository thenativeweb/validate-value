import { defekt } from 'defekt';
import { ErrorObject } from 'ajv';

class ParseError extends defekt({ code: 'ParseError' }) {
  public constructor ({ message, originalValue, origin }: {
    message: string;
    originalValue: any;
    origin: ErrorObject;
  }) {
    super({ message, data: { originalValue, origin }});
  }
}

export { ParseError };
