import Ajv from 'ajv';
import { getByDataPath } from './getByDataPath';
import { JSONSchema7 } from 'json-schema';
import { ValidationError } from './ValidationError';

const ajvInstance: Ajv.Ajv = new Ajv();

ajvInstance.addFormat('alphanumeric', /[a-zA-Z0-9]/u);

class Value {
  public schema: JSONSchema7;

  protected validateInternal: Ajv.ValidateFunction;

  public constructor (schema: JSONSchema7) {
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
    const failingValue = getByDataPath({ object: value, dataPath: error.dataPath });

    let updatedPath = `${valueName}${error.dataPath.replace(/\//gu, separator)}`;
    let message = 'Validation failed';

    switch (error.keyword) {
      case 'required': {
        const missingPropertyName = (error.params as Ajv.RequiredParams).missingProperty;

        message = `Missing required property: ${missingPropertyName}`;
        updatedPath += `${separator}${missingPropertyName}`;

        break;
      }

      case 'additionalProperties': {
        const additionalPropertyName = (error.params as Ajv.AdditionalPropertiesParams).additionalProperty;

        message = `Unexpected additional property: ${additionalPropertyName}`;
        updatedPath += `${separator}${additionalPropertyName}`;

        break;
      }

      case 'minLength': {
        const minPropertyLength = (error.params as Ajv.LimitParams).limit;
        const actualLength = failingValue.length;

        message = `String is too short (${actualLength} chars), minimum ${minPropertyLength}`;

        break;
      }

      default: {
        // Intentionally left blank.
      }
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
