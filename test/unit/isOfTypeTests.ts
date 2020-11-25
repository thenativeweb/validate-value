import { assert } from 'assertthat';
import { invalid } from '../shared/schemas/invalid';
import { isOfType } from '../../lib/isOfType';
import { JSONSchema7 } from 'json-schema';

suite('isOfType', (): void => {
  test('throws an error if the given schema is invalid.', async (): Promise<void> => {
    assert.that((): void => {
      isOfType({}, invalid);
    }).is.throwing('unknown format "invalid-format" ignored in schema at path "#"');
  });

  test('returns true if the given value matches the schema.', async (): Promise<void> => {
    const schema: JSONSchema7 = {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 1 }
      },
      required: [ 'name' ],
      additionalProperties: false
    };

    assert.that(isOfType({ name: 'Jane' }, schema)).is.true();
  });

  test('returns false if the given value does not match the schema.', async (): Promise<void> => {
    const schema: JSONSchema7 = {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 1 }
      },
      required: [ 'name' ],
      additionalProperties: false
    };

    assert.that(isOfType({ firstName: 'Jane' }, schema)).is.false();
  });
});
