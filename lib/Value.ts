import Ajv from 'ajv';
import { JSONSchema4 } from 'json-schema';
import { ValidationError } from './ValidationError';

const ajvInstance: Ajv.Ajv = new Ajv();

ajvInstance.addFormat('alphanumeric', /[a-zA-Z0-9]/u);

class Value {
  public schema: JSONSchema4;

  protected validateInternal: Ajv.ValidateFunction;

  public constructor (schema: JSONSchema4) {
    this.schema = schema;
    this.validateInternal = ajvInstance.compile(schema);
  }

  public validate (value: any, { valueName = 'value', separator = '.' }: {
    valueName?: string;
    separator?: string;
  } = {}): void {
    const isValid = this.validateInternal(value);

    if (isValid) {
      return;
    }

    const error = this.validateInternal.errors![0];

    let updatedPath = `${valueName}${error.dataPath.replace(/\//gu, separator)}`;
    let message = 'Validation failed';

    if (error.keyword === 'required') {
      const missingPropertyName = (error.params as Ajv.RequiredParams).missingProperty;

      message = `Missing required property: ${missingPropertyName}`;

      // Ajv treats missing required properties as errors on the object that should have the property, so the name of
      // the missing property is missing in the data path and must be appended.
      updatedPath += `${separator}${missingPropertyName}`;
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
