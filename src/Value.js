'use strict';

const Ajv = require('ajv');

class Value {
  constructor (schema) {
    if (!schema) {
      throw new Error('Schema is missing.');
    }

    this.schema = schema;
  }

  validate (value) {
    if (value === undefined) {
      throw new Error('Value is missing.');
    }

    const ajv = new Ajv();
    const isValid = ajv.validate(this.schema, value);

    if (isValid) {
      return;
    }

    const message = `${ajv.errorsText(ajv.errors, { dataVar: 'Value' })}.`;
    const error = new Error(message);

    error.origins = ajv.errors;

    throw error;
  }

  isValid (value) {
    if (value === undefined) {
      throw new Error('Value is missing.');
    }

    try {
      this.validate(value);
    } catch (ex) {
      return false;
    }

    return true;
  }
}

module.exports = Value;
