import { JSONSchema4 } from 'json-schema';
import { ValidationError } from './ValidationError';
import { validator } from '@exodus/schemasafe';

class Value {
  public schema: JSONSchema4;

  public constructor (schema: JSONSchema4) {
    this.schema = schema;
  }

  public validate (value: any, { valueName = 'value', separator = '.' }: {
    valueName?: string;
    separator?: string;
  } = {}): void {
    const validate = validator(this.schema, { includeErrors: true });
    const isValid = validate(value);

    if (isValid) {
      return;
    }

    const error = validate.errors![0];

    const updatedPath = `${valueName}${error.instanceLocation.slice(1).replace(/\//gu, separator)}`;
    let message = 'Validation failed';

    if (error.keywordLocation.endsWith('/required')) {
      message = `Missing required property: ${updatedPath.slice(updatedPath.lastIndexOf(separator) + 1)}`;
    }

    throw new ValidationError(`${message} (at ${updatedPath}).`, error);
  }

  public isValid (value: any): boolean {
    try {
      this.validate(value);
    } catch {
      return false;
    }

    return true;
  }
}

export { Value };
