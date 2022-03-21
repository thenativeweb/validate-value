import { assert } from 'assertthat';
import { boolean } from '../shared/schemas/boolean';
import { formats } from '../shared/schemas/formats';
import { getDefaultAjvInstance } from '../../lib/getDefaultAjvInstance';
import { invalid } from '../shared/schemas/invalid';
import { JsonSchema } from '../../lib';
import { Parser } from '../../lib/Parser';
import { user } from '../shared/schemas/user';
import { value } from 'defekt';

interface User {
  username: string;
  password: string;
}

suite('Parser', (): void => {
  test('throws an error if the given schema is invalid.', async (): Promise<void> => {
    assert.that((): void => {
      // eslint-disable-next-line no-new
      new Parser(invalid);
    }).is.throwing('unknown format "invalid-format" ignored in schema at path "#"');
  });

  test('does not throw an error on advanced formats.', async (): Promise<void> => {
    assert.that((): void => {
      // eslint-disable-next-line no-new
      new Parser(formats);
    }).is.not.throwing();
  });

  test('supports custom Ajv instances.', async (): Promise<void> => {
    const customAjvInstance = getDefaultAjvInstance();

    customAjvInstance.addFormat('made-up', {
      type: 'string',
      validate (currentValue: string): boolean {
        return currentValue === 'made-up';
      }
    });

    const schema: JsonSchema = {
      type: 'string',
      format: 'made-up'
    };

    const parser = new Parser(schema, { ajvInstance: customAjvInstance });

    assert.that(parser.isValid('non-made-up-value')).is.false();
  });

  suite('parse', (): void => {
    let parser: Parser<User>;

    setup(async (): Promise<void> => {
      parser = new Parser(user);
    });

    test('does not throw an error if value is a falsy value.', async (): Promise<void> => {
      parser = new Parser(boolean);

      parser.parse(false);

      assert.that((): void => {
        parser.parse(false);
      }).is.not.throwing();
    });

    test('returns an error with the given value name if schema does not match.', async (): Promise<void> => {
      const result = parser.parse({
        username: 'Jane Doe'
      }, { valueName: 'root' });

      assert.that(result).is.anErrorWithMessage(
        'Missing required property: password (at root.password).'
      );
    });

    test('returns an error with the given separator if schema does not match.', async (): Promise<void> => {
      const result = parser.parse({
        username: 'Jane Doe'
      }, { separator: '/' });

      assert.that(result).is.anErrorWithMessage(
        'Missing required property: password (at value/password).'
      );
    });

    test('returns an error with the given value name and separator if schema does not match.', async (): Promise<void> => {
      const result = parser.parse({
        username: 'Jane Doe'
      }, { valueName: 'root', separator: '/' });

      assert.that(result).is.anErrorWithMessage(
        'Missing required property: password (at root/password).'
      );
    });

    test('returns only the first error when there are more than one.', async (): Promise<void> => {
      const result = parser.parse({});

      assert.that(result).is.anErrorWithMessage(
        'Missing required property: username (at value.username).'
      );
    });

    test('returns a parsed value if schema matches.', async (): Promise<void> => {
      const result = parser.parse({
        username: 'Jane Doe',
        password: 'secret'
      });

      assert.that(result).is.aValue();
      assert.that(result).is.equalTo(value({
        username: 'Jane Doe',
        password: 'secret'
      }));
    });

    test('supports additional formats.', async (): Promise<void> => {
      parser = new Parser({
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: [ 'id' ],
        additionalProperties: false
      });

      const result = parser.parse({
        id: '23'
      });

      assert.that(result).is.anErrorWithMessage(
        'Value does not satisfy format: uuid (at value.id).'
      );
    });

    test('supports union types.', async (): Promise<void> => {
      parser = new Parser({
        type: 'object',
        properties: {
          id: {
            oneOf: [
              { type: [ 'string', 'number' ]}
            ]
          }
        },
        required: [ 'id' ],
        additionalProperties: false
      });

      const result = parser.parse({
        id: true
      });

      assert.that(result).is.anErrorWithMessage(
        'Invalid type: boolean should be string, number (at value.id).'
      );
    });

    suite('error messages', (): void => {
      test('returns an error if a required property is missing.', async (): Promise<void> => {
        parser = new Parser({
          type: 'object',
          properties: {
            username: { type: 'string' },
            password: { type: 'string' }
          },
          required: [ 'username', 'password' ],
          additionalProperties: false
        });

        const result = parser.parse({
          username: 'Jane Doe'
        });

        assert.that(result).is.anErrorWithMessage('Missing required property: password (at value.password).');
      });

      test('returns an error if an additional property is given, but additional properties are forbidden.', async (): Promise<void> => {
        parser = new Parser({
          type: 'object',
          properties: {
            username: { type: 'string' },
            password: { type: 'string' }
          },
          required: [ 'username', 'password' ],
          additionalProperties: false
        });

        const result = parser.parse({
          username: 'Jane Doe',
          password: 'secret',
          login: 'jane.doe'
        });

        assert.that(result).is.anErrorWithMessage('Unexpected additional property: login (at value.login).');
      });

      test('returns an error if a string undercuts a minimum length.', async (): Promise<void> => {
        parser = new Parser({
          type: 'object',
          properties: {
            username: { type: 'string', minLength: 4 }
          },
          required: [ 'username' ],
          additionalProperties: false
        });

        const result = parser.parse({
          username: 'foo'
        });

        assert.that(result).is.anErrorWithMessage('String is too short (3 chars), minimum 4 (at value.username).');
      });

      test('returns an error if a string undercuts a minimum length and a value name is given.', async (): Promise<void> => {
        parser = new Parser({
          type: 'object',
          properties: {
            metadata: {
              type: 'object',
              properties: {
                client: {
                  type: 'object',
                  properties: {
                    ip: { type: 'string', minLength: 1 }
                  },
                  required: [ 'ip' ],
                  additionalProperties: false
                }
              },
              required: [
                'client'
              ],
              additionalProperties: false
            }
          },
          required: [
            'metadata'
          ],
          additionalProperties: false
        });

        const result = parser.parse({
          metadata: {
            client: {
              ip: ''
            }
          }
        }, { valueName: 'requestBody' });

        assert.that(result).is.anErrorWithMessage('String is too short (0 chars), minimum 1 (at requestBody.metadata.client.ip).');
      });

      test('returns an error if a string exceeds a maximum length.', async (): Promise<void> => {
        parser = new Parser({
          type: 'object',
          properties: {
            username: { type: 'string', maxLength: 20 }
          },
          required: [ 'username' ],
          additionalProperties: false
        });

        const result = parser.parse({
          username: 'foofoofoofoofoofoofoo'
        });

        assert.that(result).is.anErrorWithMessage('String is too long (21 chars), maximum 20 (at value.username).');
      });

      test('returns an error if a value undercuts a minimum.', async (): Promise<void> => {
        parser = new Parser({
          type: 'object',
          properties: {
            count: { type: 'number', minimum: 5 }
          },
          required: [ 'count' ],
          additionalProperties: false
        });

        const result = parser.parse({
          count: 3
        });

        assert.that(result).is.anErrorWithMessage('Value 3 is less than minimum 5 (at value.count).');
      });

      test('returns an error if a value exceeds a maximum.', async (): Promise<void> => {
        parser = new Parser({
          type: 'object',
          properties: {
            count: { type: 'number', maximum: 7 }
          },
          required: [ 'count' ],
          additionalProperties: false
        });

        const result = parser.parse({
          count: 19
        });

        assert.that(result).is.anErrorWithMessage('Value 19 is more than maximum 7 (at value.count).');
      });

      test('returns an error if a string does not match any value of an enum.', async (): Promise<void> => {
        parser = new Parser({
          type: 'object',
          properties: {
            result: { type: 'string', enum: [ 'succeed', 'fail', 'reject' ]}
          },
          required: [ 'result' ],
          additionalProperties: false
        });

        const result = parser.parse({
          result: 'invalid-value'
        });

        assert.that(result).is.anErrorWithMessage('No enum match (invalid-value), expects: succeed, fail, reject (at value.result).');
      });

      test('returns an error if a string does not match a regular expression.', async (): Promise<void> => {
        parser = new Parser({
          type: 'object',
          properties: {
            result: { type: 'string', pattern: '^thenativeweb$' }
          },
          required: [ 'result' ],
          additionalProperties: false
        });

        const result = parser.parse({
          result: 'invalid-value'
        });

        assert.that(result).is.anErrorWithMessage('String does not match pattern: ^thenativeweb$ (at value.result).');
      });

      test('returns an error if an array is too short.', async (): Promise<void> => {
        parser = new Parser({
          type: 'object',
          properties: {
            result: { type: 'array', minItems: 1 }
          },
          required: [ 'result' ],
          additionalProperties: false
        });

        const result = parser.parse({
          result: []
        });

        assert.that(result).is.anErrorWithMessage('Array is too short (0), minimum 1 (at value.result).');
      });

      test('returns an error if an array is too long.', async (): Promise<void> => {
        parser = new Parser({
          type: 'object',
          properties: {
            result: { type: 'array', maxItems: 1 }
          },
          required: [ 'result' ],
          additionalProperties: false
        });

        const result = parser.parse({
          result: [ 23, 42 ]
        });

        assert.that(result).is.anErrorWithMessage('Array is too long (2), maximum 1 (at value.result).');
      });

      test('correctly validates nested array.', async (): Promise<void> => {
        parser = new Parser({
          type: 'object',
          properties: {
            result: {
              type: 'object',
              properties: {
                values: { type: 'array', minItems: 1 }
              },
              required: [ 'values' ],
              additionalProperties: false
            }
          },
          required: [ 'result' ],
          additionalProperties: false
        });

        const result = parser.parse({
          result: {
            values: []
          }
        });

        assert.that(result).is.anErrorWithMessage('Array is too short (0), minimum 1 (at value.result.values).');
      });

      test('returns an error if a value is of wrong type.', async (): Promise<void> => {
        parser = new Parser({
          type: 'object',
          properties: {
            result: { type: 'number' }
          },
          required: [ 'result' ],
          additionalProperties: false
        });

        const result = parser.parse({
          result: '23'
        });

        assert.that(result).is.anErrorWithMessage('Invalid type: string should be number (at value.result).');
      });

      test('describes arrays correctly as such.', async (): Promise<void> => {
        parser = new Parser({
          type: 'object',
          properties: {
            result: { type: 'number' }
          },
          required: [ 'result' ],
          additionalProperties: false
        });

        const result = parser.parse([ 'foo' ]);

        assert.that(result).is.anErrorWithMessage('Invalid type: array should be object (at value).');
      });
    });
  });

  suite('isValid', (): void => {
    let parser: Parser<User>;

    setup(async (): Promise<void> => {
      parser = new Parser(user);
    });

    test('does not throw an error if value is a falsy value.', async (): Promise<void> => {
      parser = new Parser(boolean);

      assert.that((): void => {
        parser.isValid(false);
      }).is.not.throwing();
    });

    test('returns false if schema does not match.', async (): Promise<void> => {
      assert.that(parser.isValid({
        username: 'Jane Doe'
      })).is.false();
    });

    test('returns true if schema matches.', async (): Promise<void> => {
      assert.that(parser.isValid({
        username: 'Jane Doe',
        password: 'secret'
      })).is.true();
    });
  });
});
