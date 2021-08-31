import addFormats from 'ajv-formats';
import { getByInstancePath } from './getByInstancePath';
import { JSONSchema7 } from 'json-schema';
import { ParseError } from './ParseError';
import { typeOf } from 'typedescriptor';
import Ajv, { ValidateFunction } from 'ajv';
import { error, Result, value } from 'defekt';

const ajvInstance = new Ajv({
  allowUnionTypes: true
});

addFormats(ajvInstance);
ajvInstance.addFormat('alphanumeric', /[a-zA-Z0-9]/u);

class Parser<TParsed> {
  protected validateInternal: ValidateFunction;

  public constructor (schema: JSONSchema7) {
    this.validateInternal = ajvInstance.compile(schema);
  }

  public parse (
    unparsedValue: any,
    { valueName = 'value', separator = '.' }: {
      valueName?: string;
      separator?: string;
    } = {}
  ): Result<TParsed, ParseError> {
    const isValid = this.validateInternal(unparsedValue);

    if (isValid) {
      return value(unparsedValue);
    }

    const validationError = this.validateInternal.errors![0];
    const failingValue = getByInstancePath({ object: unparsedValue, instancePath: validationError.instancePath });

    let updatedPath = `${valueName}${validationError.instancePath.replace(/\//gu, separator)}`;
    let message = 'Parsing failed';

    switch (validationError.keyword) {
      case 'required': {
        const missingPropertyName = validationError.params.missingProperty;

        message = `Missing required property: ${missingPropertyName}`;
        updatedPath += `${separator}${missingPropertyName}`;

        break;
      }

      case 'additionalProperties': {
        const additionalPropertyName = validationError.params.additionalProperty;

        message = `Unexpected additional property: ${additionalPropertyName}`;
        updatedPath += `${separator}${additionalPropertyName}`;

        break;
      }

      case 'minLength': {
        const minPropertyLength = validationError.params.limit;
        const actualLength = failingValue.length;

        message = `String is too short (${actualLength} chars), minimum ${minPropertyLength}`;

        break;
      }

      case 'maxLength': {
        const maxPropertyLength = validationError.params.limit;
        const actualLength = failingValue.length;

        message = `String is too long (${actualLength} chars), maximum ${maxPropertyLength}`;

        break;
      }

      case 'minimum': {
        const minimumValue = validationError.params.limit;
        const actualValue = failingValue;

        message = `Value ${actualValue} is less than minimum ${minimumValue}`;

        break;
      }

      case 'maximum': {
        const maximumValue = validationError.params.limit;
        const actualValue = failingValue;

        message = `Value ${actualValue} is more than maximum ${maximumValue}`;

        break;
      }

      case 'enum': {
        const { allowedValues } = validationError.params;
        const actualValue = failingValue;

        message = `No enum match (${actualValue}), expects: ${allowedValues.join(', ')}`;

        break;
      }

      case 'pattern': {
        const { pattern } = validationError.params;

        message = `String does not match pattern: ${pattern}`;

        break;
      }

      case 'minItems': {
        const { limit } = validationError.params;
        const actualCount = failingValue.length;

        message = `Array is too short (${actualCount}), minimum ${limit}`;

        break;
      }

      case 'maxItems': {
        const { limit } = validationError.params;
        const actualCount = failingValue.length;

        message = `Array is too long (${actualCount}), maximum ${limit}`;

        break;
      }

      case 'format': {
        const { format } = validationError.params;

        message = `Value does not satisfy format: ${format}`;
        break;
      }

      case 'type': {
        const { type } = validationError.params;
        const actualType = typeOf(failingValue);

        message = `Invalid type: ${actualType} should be ${Array.isArray(type) ? type.join(', ') : type}`;
        break;
      }

      default: {
        // Intentionally left blank.
      }
    }

    return error(new ParseError({
      message: `${message} (at ${updatedPath}).`,
      originalValue: unparsedValue,
      origin: validationError
    }));
  }

  public isValid (
    unparsedValue: any
  ): boolean {
    const isValid = this.validateInternal(unparsedValue);

    if (isValid) {
      return true;
    }

    return false;
  }
}

export {
  Parser
};
