import { get } from 'mutation-helper';

export function clearIndexes(path) {
  return path.replace(/\[\d+\]/g, '[]');
}

function add(list, item) {
  if (!list.includes(item)) {
    list.push(item);
  }
}

function derivatePaths(paths, data, prefix, remainingPaths) {
  if (remainingPaths.length === 0) {
    add(paths, prefix);
  }

  const list = get(data, prefix);
  const suffix = remainingPaths.pop();

  if (list.forEach) {
    list.forEach((_, idx) => {
      derivatePaths(paths, data, `${prefix}[${idx}]${suffix}`, remainingPaths.slice());
    });
  }
}

export function interpolatePaths(schemaData, data) {
  const rawValidationPaths = Object.keys(schemaData);
  const paths = [];

  rawValidationPaths.forEach(jsonPath => {
    const rawJsonPath = clearIndexes(jsonPath);
    const nestedPaths = rawJsonPath
      .split('[]')
      .map(value => value.trim())
      .reverse();
    const parentPath = nestedPaths.pop();

    if (parentPath) {
      add(paths, parentPath);
    }

    if (nestedPaths.length > 0) {
      derivatePaths(paths, data, parentPath, nestedPaths);
    }
  });

  return paths;
}

export function createValidations(invalidationPaths, ...validations) {
  function validate(args) {
    return validations.map(checkValidation => checkValidation(args));
  }

  return {
    invalidationPaths,
    validate,
  };
}
