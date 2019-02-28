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

  validate (value) {
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
    const { message } = errors[0];

    const error = new Error(message);

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
