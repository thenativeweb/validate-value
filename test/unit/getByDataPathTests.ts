import { assert } from 'assertthat';
import { getByDataPath } from '../../lib/getByDataPath';

suite('getByDataPath', (): void => {
  test('traverses an object by following an ajv data path.', async (): Promise<void> => {
    const object = {
      foo: {
        bar: {
          baz: 'bam'
        }
      }
    };

    const result = getByDataPath({ object, dataPath: '.foo.bar.baz' });

    assert.that(result).is.equalTo('bam');
  });

  test('returns undefined, if the path does not match anything.', async (): Promise<void> => {
    const object = {};

    const result = getByDataPath({ object, dataPath: '.foo.bar.baz' });

    assert.that(result).is.undefined();
  });

  test('returns undefined, if the object is undefined.', async (): Promise<void> => {
    const object = undefined;

    const result = getByDataPath({ object, dataPath: '.foo.bar.baz' });

    assert.that(result).is.undefined();
  });
});
