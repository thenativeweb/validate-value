import addFormats from 'ajv-formats';
import Ajv from 'ajv';

const getDefaultAjvInstance = function (): Ajv {
  const defaultAjvInstance = new Ajv({
    allowUnionTypes: true
  });

  addFormats(defaultAjvInstance);
  defaultAjvInstance.addFormat('alphanumeric', /[a-zA-Z0-9]/u);

  return defaultAjvInstance;
};

export { getDefaultAjvInstance };
