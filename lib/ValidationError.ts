import Ajv from 'ajv';

class ValidationError extends Error {
  public origin: Ajv.ErrorObject;

  public constructor (message: string, origin: Ajv.ErrorObject) {
    super(message);
    this.origin = origin;
  }
}

export { ValidationError };
