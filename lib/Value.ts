import addFormats from 'ajv-formats';
import { getByDataPath } from './getByDataPath';
import { JSONSchema7 } from 'json-schema';
import { ValidationError } from './ValidationError';
import Ajv, { ValidateFunction } from 'ajv';

const ajvInstance = new Ajv({
  allowUnionTypes: true
});

addFormats(ajvInstance);
ajvInstance.addFormat('alphanumeric', /[a-zA-Z0-9]/u);

class Value {
  public schema: JSONSchema7;

  protected validateInternal: ValidateFunction;

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
        const missingPropertyName = error.params.missingProperty;

        message = `Missing required property: ${missingPropertyName}`;
        updatedPath += `${separator}${missingPropertyName}`;

        break;
      }

      case 'additionalProperties': {
        const additionalPropertyName = error.params.additionalProperty;

        message = `Unexpected additional property: ${additionalPropertyName}`;
        updatedPath += `${separator}${additionalPropertyName}`;

        break;
      }

      case 'minLength': {
        const minPropertyLength = error.params.limit;
        const actualLength = failingValue.length;

        message = `String is too short (${actualLength} chars), minimum ${minPropertyLength}`;

        break;
      }

      case 'maxLength': {
        const maxPropertyLength = error.params.limit;
        const actualLength = failingValue.length;

        message = `String is too long (${actualLength} chars), maximum ${maxPropertyLength}`;

        break;
      }

      case 'minimum': {
        const minimumValue = error.params.limit;
        const actualValue = failingValue;

        message = `Value ${actualValue} is less than minimum ${minimumValue}`;

        break;
      }

      case 'maximum': {
        const maximumValue = error.params.limit;
        const actualValue = failingValue;

        message = `Value ${actualValue} is more than maximum ${maximumValue}`;

        break;
      }

      case 'enum': {
        const { allowedValues } = error.params;
        const actualValue = failingValue;

        message = `No enum match (${actualValue}), expects: ${allowedValues.join(', ')}`;

        break;
      }

      case 'pattern': {
        const { pattern } = error.params;

        message = `String does not match pattern: ${pattern}`;

        break;
      }

      case 'minItems': {
        const { limit } = error.params;
        const actualCount = failingValue.length;

        message = `Array is too short (${actualCount}), minimum ${limit}`;

        break;
      }

      case 'maxItems': {
        const { limit } = error.params;
        const actualCount = failingValue.length;

        message = `Array is too long (${actualCount}), maximum ${limit}`;

        break;
      }

      case 'format': {
        const { format } = error.params;

        message = `Value does not satisfy format: ${format}`;
        break;
      }

      case 'type': {
        const { type } = error.params;
        const actualType = typeof failingValue;

        message = `Invalid type: ${actualType} should be ${type}`;
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
