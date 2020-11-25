import { ErrorObject } from 'ajv';

class ValidationError extends Error {
  public origin: ErrorObject;

  public constructor (message: string, origin: ErrorObject) {
    super(message);
    this.origin = origin;
  }
}

export { ValidationError };
