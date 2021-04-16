const getByInstancePath = function ({ object, instancePath }: { object: any; instancePath: string }): any {
  const pathSegments = instancePath.replace(/\//ug, '.').split('.');
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

export { getByInstancePath };
