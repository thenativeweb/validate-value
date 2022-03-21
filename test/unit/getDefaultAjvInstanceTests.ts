import { assert } from 'assertthat';
import { isCustomError } from 'defekt';
import { getDefaultAjvInstance, ParseError, Parser } from '../../lib';

suite('getDefaultAjvInstance', (): void => {
  test('allows union types.', async (): Promise<void> => {
    const defaultAjvInstance = getDefaultAjvInstance();
    const parser = new Parser({
      type: [ 'string', 'number' ]
    }, {
      ajvInstance: defaultAjvInstance
    });

    assert.that((): void => {
      parser.parse(null).unwrapOrThrow();
    }).is.throwing(
      (ex): boolean => isCustomError(ex) && ex.code === ParseError.code
    );
    assert.that((): void => {
      parser.parse([ false ]).unwrapOrThrow();
    }).is.throwing(
      (ex): boolean => isCustomError(ex) && ex.code === ParseError.code
    );
    assert.that((): void => {
      parser.parse({ foo: 'bar' }).unwrapOrThrow();
    }).is.throwing(
      (ex): boolean => isCustomError(ex) && ex.code === ParseError.code
    );

    assert.that((): void => {
      parser.parse('foobar').unwrapOrThrow();
    }).is.not.throwing();
    assert.that((): void => {
      parser.parse(1_337).unwrapOrThrow();
    }).is.not.throwing();
  });

  test('supports the "alphanumeric" format.', async (): Promise<void> => {
    const defaultAjvInstance = getDefaultAjvInstance();
    const parser = new Parser({
      type: 'string',
      format: 'alphanumeric'
    }, {
      ajvInstance: defaultAjvInstance
    });

    assert.that((): void => {
      parser.parse('$%&').unwrapOrThrow();
    }).is.throwing(
      (ex): boolean => isCustomError(ex) && ex.code === ParseError.code
    );
    assert.that((): void => {
      parser.parse('').unwrapOrThrow();
    }).is.throwing(
      (ex): boolean => isCustomError(ex) && ex.code === ParseError.code
    );
    assert.that((): void => {
      parser.parse(null).unwrapOrThrow();
    }).is.throwing(
      (ex): boolean => isCustomError(ex) && ex.code === ParseError.code
    );

    assert.that((): void => {
      parser.parse('foobar').unwrapOrThrow();
    }).is.not.throwing();
    assert.that((): void => {
      parser.parse('1_337').unwrapOrThrow();
    }).is.not.throwing();
    assert.that((): void => {
      parser.parse('foobar1_337').unwrapOrThrow();
    }).is.not.throwing();
  });
});
