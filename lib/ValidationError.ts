import { Issue } from 'jjve';

class ValidationError extends Error {
  public origins: Issue[];

  public constructor (message: string, origins: Issue[]) {
    super(message);
    this.origins = origins;
  }
}

export default ValidationError;
