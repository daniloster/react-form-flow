import { useContext, useCallback, useMemo, useRef } from 'react';
import { get } from 'mutation-helper';
import FormFlowDataContext from './FormFlowDataContext';
import FormFlowValidationContext from './FormFlowValidationContext';
import { clearIndexes } from './validationUtils';
import hasChanged from './hasChanged';
import hasPathMatched from './hasPathMatched';

/**
 * Perform validation over the form data based on the path provided
 */
export default function useFormFlowValidation(path = '') {
  const [data] = useContext(FormFlowDataContext);
  const [schemaData, cache] = useContext(FormFlowValidationContext);
  const { allValidations, byPath } = cache;
  const localCacheRef = useRef({ previousValues: [], validations: [] });
  const isAllValid = useCallback(
    paths => {
      const allPaths = paths || [];
      const isAllRequired = allPaths.length === 0;

      if (isAllRequired) {
        return !allValidations.some(({ isValid }) => !isValid);
      }

      return !allValidations.some(
        ({ isValid, path: validationPath }) =>
          !isValid && allPaths.some(internalPath => hasPathMatched(validationPath, internalPath))
      );
    },
    [allValidations]
  );
  const validate = useCallback(
    dataToValidate => {
      if (path.includes('[]')) {
        return allValidations.filter(({ path: jsonPath }) => path === clearIndexes(jsonPath));
      }

      const validationRules = schemaData[path] || schemaData[clearIndexes(path)];

      if (!validationRules) {
        return [];
      }
      const indexesMatches = path.match(/(\[\d+\])/g);
      const indexes = indexesMatches ? indexesMatches.slice() : [];
      const value = get(dataToValidate, path);
      const values = validationRules.invalidationPaths.map(invalidationPath =>
        get(
          dataToValidate,
          indexes.reduce(
            (finalPath, indexValue, index) => finalPath.replace(`[\$${index}]`, indexValue),
            invalidationPath
          )
        )
      );
      values.push(value);

      const hasBeenInvalidatedByDependencies = hasChanged(
        values,
        localCacheRef.current.previousValues
      );

      if (hasBeenInvalidatedByDependencies) {
        localCacheRef.current.validations = validationRules.validate({
          data: dataToValidate,
          get,
          path,
          value,
        });
        localCacheRef.current.validations.forEach(validation => allValidations.push(validation));
      }

      return localCacheRef.current.validations;
    },
    [path, schemaData, allValidations]
  );
  const validations = useMemo(() => {
    if (!path) {
      return allValidations;
    }

    if (byPath[path]) {
      return byPath[path];
    }

    return validate(data, path);
  }, [data, allValidations, byPath, path, validate]);

  if (path) {
    byPath[path] = validations;
  }

  return {
    cache,
    data,
    isAllValid,
    validations,
  };
}
