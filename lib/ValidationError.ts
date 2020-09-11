import { ValidationError as OriginError } from '@exodus/schemasafe';

class ValidationError extends Error {
  public origin: OriginError;

  public constructor (message: string, origin: OriginError) {
    super(message);
    this.origin = origin;
  }
}

export { ValidationError };
