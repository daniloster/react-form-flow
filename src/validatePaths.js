import getMapByKeys from './getMapByKeys';
import validateAt from './validateAt';
import { clearIndexes, interpolatePaths } from './validationUtils';

export default function validatePaths(schemaData, data, byPath, pathsToValidate) {
  const newAllPaths = interpolatePaths(schemaData, data);
  const paths = pathsToValidate || newAllPaths;
  const strippedByPath = getMapByKeys(byPath, newAllPaths);
  const newByPath = {};
  newAllPaths
    .filter(path => paths.includes(path) || paths.includes(clearIndexes(path)))
    .forEach(path => {
      const validations = validateAt(path, schemaData, data);
      const pathIndexesCleared = clearIndexes(path);
      validations.forEach(validation => {
        if (pathIndexesCleared !== path) {
          newByPath[pathIndexesCleared] = newByPath[pathIndexesCleared]
            ? newByPath[pathIndexesCleared]
            : [];
          newByPath[pathIndexesCleared].push(validation);
        }
        newByPath[path] = newByPath[path] || [];
        newByPath[path].push(validation);
      });
    });

  return {
    allPaths: newAllPaths,
    allValidations: Object.values(newByPath).reduce(
      (allValidations, validations) => allValidations.concat(validations),
      []
    ),
    byPath: { ...strippedByPath, ...newByPath },
  };
}
