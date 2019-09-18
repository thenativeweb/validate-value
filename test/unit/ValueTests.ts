import assert from 'assertthat';
import schemas from '../shared/schemas';
import ValidationError from '../../lib/ValidationError';
import Value from '../../lib/Value';

suite('Value', (): void => {
  test('is a function.', async (): Promise<void> => {
    assert.that(Value).is.ofType('function');
  });

  suite('validate', (): void => {
    let schema: Value;

    setup((): void => {
      schema = new Value(schemas.user);
    });

    test('does not throw an error if value is a falsy value.', async (): Promise<void> => {
      schema = new Value(schemas.boolean);

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
      }).is.throwing((ex: Error): boolean =>
        ex.message === 'Missing required property: password (at value.password).' &&
        Array.isArray((ex as ValidationError).origins));
    });

    test('throws an error with the given value name if schema does not match.', async (): Promise<void> => {
      assert.that((): void => {
        schema.validate({
          username: 'Jane Doe'
        }, { valueName: 'root' });
      }).is.throwing((ex: Error): boolean =>
        ex.message === 'Missing required property: password (at root.password).' &&
        Array.isArray((ex as ValidationError).origins));
    });

    test('throws an error with the given separator if schema does not match.', async (): Promise<void> => {
      assert.that((): void => {
        schema.validate({
          username: 'Jane Doe'
        }, { separator: '/' });
      }).is.throwing((ex: Error): boolean =>
        ex.message === 'Missing required property: password (at value/password).' &&
        Array.isArray((ex as ValidationError).origins));
    });

    test('throws an error with the given value name and separator if schema does not match.', async (): Promise<void> => {
      assert.that((): void => {
        schema.validate({
          username: 'Jane Doe'
        }, { valueName: 'root', separator: '/' });
      }).is.throwing((ex: Error): boolean =>
        ex.message === 'Missing required property: password (at root/password).' &&
        Array.isArray((ex as ValidationError).origins));
    });

    test('throws only the first error when there are more than one.', async (): Promise<void> => {
      assert.that((): void => {
        schema.validate({});
      }).is.throwing((ex: Error): boolean =>
        ex.message === `Missing required property: username (at value.username).` &&
        Array.isArray((ex as ValidationError).origins));
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

    setup((): void => {
      schema = new Value(schemas.user);
    });

    test('does not throw an error if value is a falsy value.', async (): Promise<void> => {
      schema = new Value(schemas.boolean);

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
