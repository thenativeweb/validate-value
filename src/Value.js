'use strict';

const jjv = require('jjv'),
      jjve = require('jjve');

class Value {
  constructor (schema) {
    if (!schema) {
      throw new Error('Schema is missing.');
    }

    this.schema = schema;
  }

  validate (value, { valueName = 'value', separator = '.' } = {}) {
    if (value === undefined) {
      throw new Error('Value is missing.');
    }

    const { schema } = this;

    const validator = jjv();
    const getErrors = jjve(validator);

    const result = validator.validate(schema, value);

    if (!result) {
      return;
    }

    const errors = getErrors(schema, value, result);
    const { message, path } = errors[0];

    const updatedPath = `${valueName}${path.substring(1).replace(/\./, separator)}`;

    const error = new Error(`${message} (at ${updatedPath}).`);

    error.origins = errors;

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
