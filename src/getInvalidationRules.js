import { clearIndexes, clearIndexesIterator, getIndexesIterator } from './validationUtils';

/**
 * Collects all the invalidation paths
 * @param {SchemaData} schemaData
 * @returns {object} map between paths that trigger invalidation on validation cache
 */
export default function getInvalidationRules(schemaData) {
  const invalidationRules = {};
  Object.entries(schemaData).forEach(([path, validationRules]) => {
    validationRules.invalidationPaths.concat(path).forEach(invalidationPath => {
      const invalidationPathIndexesCleared = clearIndexes(invalidationPath);
      const invalidationPathIndexesClearedIterator = clearIndexesIterator(invalidationPath);
      const iterators = getIndexesIterator(invalidationPath);
      const hasIterationMapping = !!iterators.join('');
      // contacts[].types[] => contacts[$1].values[$0] => [1, 0]
      // contacts[].types[] => messages[$1] => [1]

      const specificPath = hasIterationMapping
        ? iterators.reduce(
            (finalPath, indexValue) => finalPath.replace('[]', `[$${indexValue}]`),
            path
          )
        : '';

      // invalidation rules are for all items in the array
      if (invalidationPath !== invalidationPathIndexesCleared) {
        invalidationRules[invalidationPathIndexesCleared] =
          invalidationRules[invalidationPathIndexesCleared] || [];
        invalidationRules[invalidationPathIndexesCleared].push(path);
      }

      invalidationRules[invalidationPath] = invalidationRules[invalidationPath] || [];
      invalidationRules[invalidationPath].push(path);

      invalidationRules[invalidationPathIndexesClearedIterator] =
        invalidationRules[invalidationPathIndexesClearedIterator] || [];
      const hasIterationMappingRule =
        hasIterationMapping &&
        !invalidationRules[invalidationPathIndexesClearedIterator].includes(specificPath);
      if (hasIterationMappingRule) {
        invalidationRules[invalidationPathIndexesClearedIterator].push(specificPath);
      }
    });
  });

  return invalidationRules;
}
