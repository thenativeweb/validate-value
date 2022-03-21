import { assert } from 'assertthat';
import { getDefaultAjvInstance } from '../../lib/getDefaultAjvInstance';

suite('getDefaultAjvInstance', (): void => {
  test('allows union types.', async (): Promise<void> => {
    const defaultAjvInstance = getDefaultAjvInstance();

    assert.that(defaultAjvInstance.opts.allowUnionTypes).is.true();
  });

  test('adds support for alphanumeric format.', async (): Promise<void> => {
    const defaultAjvInstance = getDefaultAjvInstance();
    const alphanumericFormat = defaultAjvInstance.formats.alphanumeric;

    assert.that(alphanumericFormat).is.not.undefined();
  });
});
