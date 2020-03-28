import { get } from 'mutation-helper';
import { interpolatePaths, clearIndexes } from '../validationUtils';
import getAbsolutePath from '../getAbsolutePath';

/**
 * Wraps the schema returning an object with validate and
 * validateAt functions which have a cache layer
 * @param {Object} schema
 * @returns {import('./types').Validator}
 */
export default function wrapSchemaWithValidationMethods(schema) {
  const cache = {};

  return {
    // eslint-disable-next-line no-use-before-define
    validate: validateData,
    // eslint-disable-next-line no-use-before-define
    validateAt: (data, path) => validateDataAt(data, path),
  };

  function validateData(data) {
    const allPaths = interpolatePaths(schema, data);
    /**
     * Basically, we need to clear out the pre-existing validation as it can only
     * be trigger by data or schema changes which would invalidate the form validations.
     */
    const validationsState = {};
    validationsState.allPaths = allPaths;
    validationsState.allValidations = [];
    validationsState.byPath = {};

    allPaths.forEach(path => {
      // eslint-disable-next-line no-use-before-define
      validateDataAt(data, path).forEach(validation => {
        const pathIndexesCleared = clearIndexes(path);
        if (pathIndexesCleared !== path) {
          validationsState.byPath[pathIndexesCleared] =
            validationsState.byPath[pathIndexesCleared] || [];
          validationsState.byPath[pathIndexesCleared].push(validation);
        }
        validationsState.byPath[path] = validationsState.byPath[path] || [];
        validationsState.byPath[path].push(validation);
        validationsState.allValidations.push(validation);
      });
    });

    return validationsState;
  }

  function validateDataAt(data, path) {
    const pathIndexesCleared = clearIndexes(path);
    const { invalidationPaths, validate } = schema[path] || schema[pathIndexesCleared];
    cache[path] = cache[path] || {};
    const cacheAtPath = cache[path];

    if (!cacheAtPath.dependencies) {
      const ancestorsPathParts = path.split('.');
      const indexesMatches = path.match(/(\[\d+\])/g);
      const indexes = indexesMatches ? indexesMatches.slice() : [];
      cacheAtPath.dependencies = [path].concat(invalidationPaths).map(invalidationPath => {
        const absolutePath = getAbsolutePath(ancestorsPathParts, invalidationPath);
        return indexes.reduce(
          (finalPath, indexValue, index) => finalPath.replace(`[$${index}]`, indexValue),
          absolutePath
        );
      });
      cacheAtPath.dependencyValues = Array.from({ length: cacheAtPath.dependencies.length }).map(
        () => null
      );
      cacheAtPath.previousValidations = null;
    }

    const paths = cacheAtPath.dependencies;
    const currentDependencyValues = [];
    const isChanged = paths.reduce((isOverallChanged, jsonPath, index) => {
      currentDependencyValues.push(get(data, jsonPath));
      if (isOverallChanged) {
        return true;
      }
      return currentDependencyValues[index] !== cacheAtPath.dependencyValues[index];
    }, false);

    /**
     * Computing validations and returning cache if the invalidations hasn't changed
     */
    let validations = null;
    if (!isChanged && cacheAtPath.previousValidations !== null) {
      validations = cacheAtPath.previousValidations;
    } else {
      validations = validate({
        data,
        get,
        path,
        value: currentDependencyValues[0],
        dependencies: currentDependencyValues.slice(1),
      });
    }

    /**
     * Appending computed validations
     */
    cacheAtPath.previousValidations = validations;
    cacheAtPath.dependencyValues = currentDependencyValues;

    return validations;
  }
}
