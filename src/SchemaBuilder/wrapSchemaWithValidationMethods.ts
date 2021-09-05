import { get } from '../accessor';
import getAbsolutePath from '../getAbsolutePath';
import { clearIndexes, interpolatePaths } from '../validationUtils';
import AggregatedValidator from './AggregatedValidator';
import SchemaValidationMethods from './SchemaValidationMethods';
import Validation from './Validation';
import ValidationState from './ValidationState';

type ValidationCache = {
  dependencies: string[];
  dependencyValues: any[];
  previousValidations: Validation[] | null;
};

/**
 * Wraps the schema returning an object with validate and
 * validateAt functions which have a cache layer
 * @param {Object} schema
 * @returns {import('./types').Validator}
 */
export default function wrapSchemaWithValidationMethods(schema: {
  [key: string]: AggregatedValidator;
}): SchemaValidationMethods {
  const cache: { [key: string]: ValidationCache } = {};

  return {
    // eslint-disable-next-line no-use-before-define
    validate: validateData,
    // eslint-disable-next-line no-use-before-define
    validateAt: (data: Object, path: string) => validateDataAt(data, path),
  };

  function validateData(data: Object): ValidationState {
    const allPaths = interpolatePaths(schema, data);
    /**
     * Basically, we need to clear out the pre-existing validation as it can only
     * be trigger by data or schema changes which would invalidate the form validations.
     */
    const validationsState: ValidationState = {
      allPaths,
      allValidations: [],
      byPath: {},
    };

    allPaths.forEach(path => {
      // eslint-disable-next-line no-use-before-define
      validateDataAt(data, path).forEach((validation: Validation) => {
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

  function validateDataAt(data: Object, path: string): Validation[] {
    const pathIndexesCleared = clearIndexes(path);
    const { invalidationPaths, validate } = schema[path] || schema[pathIndexesCleared];
    cache[path] = cache[path] || {
      dependencies: undefined,
      dependencyValues: undefined,
      previousValidations: undefined,
    };
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
    const currentDependencyValues: any[] = [];
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
