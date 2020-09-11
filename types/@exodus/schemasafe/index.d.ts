declare module '@exodus/schemasafe' {
  export interface ValidationError {
    keywordLocation: string;
    instanceLocation: string;
  }

  export interface Validate {
    (value: any): boolean;
    errors?: ValidationError[];
  }

  export const validator: (schema: object, options?: {
    includeErrors?: boolean;
    allErrors?: boolean;
  }) => Validate;
}
