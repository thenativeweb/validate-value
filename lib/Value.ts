import jjv from 'jjv';
import jjve from 'jjve';
import ValidationError from './ValidationError';

class Value {
  public schema: object;

  public constructor (schema: object) {
    this.schema = schema;
  }

  public validate (value: any, { valueName = 'value', separator = '.' }: {
    valueName?: string;
    separator?: string;
  } = {}): void {
    const validator = jjv();
    const getErrors = jjve(validator);

    const result = validator.validate(this.schema, value);

    if (!result) {
      return;
    }

    const errors = getErrors(this.schema, value, result);
    const { message, path } = errors[0];

    const updatedPath = `${valueName}${path.substring(1).replace(/\./ug, separator)}`;

    const error = new ValidationError(`${message} (at ${updatedPath}).`, errors);

    throw error;
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

export default Value;
