import validatePaths from './validatePaths';
import { clearIndexes } from './validationUtils';

const EMPTY_LIST = [];
export default function updateValidationsByTriggerJsonPath(
  observableStateValidation,
  data,
  triggerJsonPath
) {
  const { byPath, invalidationRules, schemaData } = observableStateValidation.get();

  const clearIndexesTriggerJsonPath = clearIndexes(triggerJsonPath);
  const paths = (
    invalidationRules[triggerJsonPath] ||
    invalidationRules[clearIndexesTriggerJsonPath] ||
    EMPTY_LIST
  ).map(path => {
    const basePath = clearIndexes(triggerJsonPath) === path ? triggerJsonPath : path;
    const indexesMatches = triggerJsonPath.match(/(\[\d+\])/g);
    const indexes = indexesMatches ? indexesMatches.slice() : [];
    return indexes.reduce(
      (finalPath, indexValue, index) => finalPath.replace(`[$${index}]`, indexValue),
      basePath
    );
  });

  observableStateValidation.set(metadata => ({
    ...metadata,
    ...validatePaths(schemaData, data, byPath, paths),
  }));
}
