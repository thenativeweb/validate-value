import { assert } from 'assertthat';
import { boolean } from '../shared/schemas/boolean';
import { formats } from '../shared/schemas/formats';
import { invalid } from '../shared/schemas/invalid';
import { regex } from '../shared/schemas/regex';
import { user } from '../shared/schemas/user';
import { Value } from '../../lib/Value';

suite('Value', (): void => {
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

    test('throws an error when a regex string validation fails.', async (): Promise<void> => {
      schema = new Value(regex);

      assert.that((): void => {
        schema.validate({ value: '111' });
      }).is.throwing((ex: Error): boolean => ex.message === `Validation failed (at value.value).`);
    });

    test('does not throw an error if schema matches.', async (): Promise<void> => {
      assert.that((): void => {
        schema.validate({
          username: 'Jane Doe',
          password: 'secret'
        });
      }).is.not.throwing();
    });

    suite('error messages', (): void => {
      test('throws an error if a required property is missing.', async (): Promise<void> => {
        schema = new Value({
          type: 'object',
          properties: {
            username: { type: 'string' },
            password: { type: 'string' }
          },
          required: [ 'username', 'password' ],
          additionalProperties: false
        });

        assert.that((): void => {
          schema.validate({
            username: 'Jane Doe'
          });
        }).is.throwing((ex: Error): boolean => ex.message === 'Missing required property: password (at value.password).');
      });

      test('throws an error if an additional property is given, but additional properties are forbidden.', async (): Promise<void> => {
        schema = new Value({
          type: 'object',
          properties: {
            username: { type: 'string' },
            password: { type: 'string' }
          },
          required: [ 'username', 'password' ],
          additionalProperties: false
        });

        assert.that((): void => {
          schema.validate({
            username: 'Jane Doe',
            password: 'secret',
            login: 'jane.doe'
          });
        }).is.throwing((ex: Error): boolean => ex.message === 'Unexpected additional property: login (at value.login).');
      });

      test('throws an error if a string undercuts a minimum length.', async (): Promise<void> => {
        schema = new Value({
          type: 'object',
          properties: {
            username: { type: 'string', minLength: 4 }
          },
          required: [ 'username' ],
          additionalProperties: false
        });

        assert.that((): void => {
          schema.validate({
            username: 'foo'
          });
        }).is.throwing((ex: Error): boolean => ex.message === 'String is too short (3 chars), minimum 4 (at value.username).');
      });

      test('throws an error if a string exceeds a maximum length.', async (): Promise<void> => {
        schema = new Value({
          type: 'object',
          properties: {
            username: { type: 'string', maxLength: 20 }
          },
          required: [ 'username' ],
          additionalProperties: false
        });

        assert.that((): void => {
          schema.validate({
            username: 'foofoofoofoofoofoofoo'
          });
        }).is.throwing((ex: Error): boolean => ex.message === 'String is too long (21 chars), maximum 20 (at value.username).');
      });

      test('throws an error if a value undercuts a minimum.', async (): Promise<void> => {
        schema = new Value({
          type: 'object',
          properties: {
            count: { type: 'number', minimum: 5 }
          },
          required: [ 'count' ],
          additionalProperties: false
        });

        assert.that((): void => {
          schema.validate({
            count: 3
          });
        }).is.throwing((ex: Error): boolean => ex.message === 'Value 3 is less than minimum 5 (at value.count).');
      });

      test('throws an error if a value exceeds a maximum.', async (): Promise<void> => {
        schema = new Value({
          type: 'object',
          properties: {
            count: { type: 'number', maximum: 7 }
          },
          required: [ 'count' ],
          additionalProperties: false
        });

        assert.that((): void => {
          schema.validate({
            count: 19
          });
        }).is.throwing((ex: Error): boolean => ex.message === 'Value 19 is more than maximum 7 (at value.count).');
      });

      test('throws an error if a string does not match any value of an enum.', async (): Promise<void> => {
        schema = new Value({
          type: 'object',
          properties: {
            result: { type: 'string', enum: [ 'succeed', 'fail', 'reject' ]}
          },
          required: [ 'result' ],
          additionalProperties: false
        });

        assert.that((): void => {
          schema.validate({
            result: 'invalid-value'
          });
        }).is.throwing((ex: Error): boolean => ex.message === 'No enum match (invalid-value), expects: succeed, fail, reject (at value.result).');
      });
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
