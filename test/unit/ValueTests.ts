import { assert } from 'assertthat';
import { boolean } from '../shared/schemas/boolean';
import { formats } from '../shared/schemas/formats';
import { invalid } from '../shared/schemas/invalid';
import { user } from '../shared/schemas/user';
import { Value } from '../../lib/Value';

suite('Value', (): void => {
  test('is a function.', async (): Promise<void> => {
    assert.that(Value).is.ofType('function');
  });

  suite('validate', (): void => {
    let schema: Value;

    setup(async (): Promise<void> => {
      schema = new Value(user);
    });

    test('throws an error if the given schema is invalid.', async (): Promise<void> => {
      assert.that((): void => {
        // eslint-disable-next-line no-new
        new Value(invalid);
      }).is.throwing('unknown format "invalid-format" is used in schema at path "#"');
    });

    test('does not throw an error on advanced formats.', async (): Promise<void> => {
      assert.that((): void => {
        // eslint-disable-next-line no-new
        new Value(formats);
      }).is.not.throwing();
    });

    test('does not throw an error if value is a falsy value.', async (): Promise<void> => {
      schema = new Value(boolean);

      schema.validate(false);

      assert.that((): void => {
        schema.validate(false);
      }).is.not.throwing();
    });

    test('throws an error if schema does not match.', async (): Promise<void> => {
      assert.that((): void => {
        schema.validate({
          username: 'Jane Doe'
        });
      }).is.throwing((ex: Error): boolean => ex.message === 'Missing required property: password (at value.password).');
    });

    test('throws an error with the given value name if schema does not match.', async (): Promise<void> => {
      assert.that((): void => {
        schema.validate({
          username: 'Jane Doe'
        }, { valueName: 'root' });
      }).is.throwing((ex: Error): boolean => ex.message === 'Missing required property: password (at root.password).');
    });

    test('throws an error with the given separator if schema does not match.', async (): Promise<void> => {
      assert.that((): void => {
        schema.validate({
          username: 'Jane Doe'
        }, { separator: '/' });
      }).is.throwing((ex: Error): boolean => ex.message === 'Missing required property: password (at value/password).');
    });

    test('throws an error with the given value name and separator if schema does not match.', async (): Promise<void> => {
      assert.that((): void => {
        schema.validate({
          username: 'Jane Doe'
        }, { valueName: 'root', separator: '/' });
      }).is.throwing((ex: Error): boolean => ex.message === 'Missing required property: password (at root/password).');
    });

    test('throws only the first error when there are more than one.', async (): Promise<void> => {
      assert.that((): void => {
        schema.validate({});
      }).is.throwing((ex: Error): boolean => ex.message === `Missing required property: username (at value.username).`);
    });

    test('does not throw an error if schema matches.', async (): Promise<void> => {
      assert.that((): void => {
        schema.validate({
          username: 'Jane Doe',
          password: 'secret'
        });
      }).is.not.throwing();
    });
  });

  suite('isValid', (): void => {
    let schema: Value;

    setup(async (): Promise<void> => {
      schema = new Value(user);
    });

    test('does not throw an error if value is a falsy value.', async (): Promise<void> => {
      schema = new Value(boolean);

      assert.that((): void => {
        schema.isValid(false);
      }).is.not.throwing();
    });

    test('returns false if schema does not match.', async (): Promise<void> => {
      assert.that(schema.isValid({
        username: 'Jane Doe'
      })).is.false();
    });

    test('returns true if schema matches.', async (): Promise<void> => {
      assert.that(schema.isValid({
        username: 'Jane Doe',
        password: 'secret'
      })).is.true();
    });
  });
});
