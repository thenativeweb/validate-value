const getByDataPath = function ({ object, dataPath }: { object: any; dataPath: string }): any {
  const pathSegments = dataPath.split('.');
  const nonEmptyPathSegments = pathSegments.filter((segment): boolean => segment !== '');

  let value = object;

  for (const pathSegment of nonEmptyPathSegments) {
    if (value === undefined) {
      break;
    }

    value = value[pathSegment];
  }

  return value;
};

export { getByDataPath };
