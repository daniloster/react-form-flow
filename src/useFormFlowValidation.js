import { useContext, useCallback, useMemo, useRef } from 'react';
import { get } from 'mutation-helper';
import FormFlowDataContext from './FormFlowDataContext';
import FormFlowValidationContext from './FormFlowValidationContext';
import { clearIndexes } from './validationUtils';

function hasChanged(currentValues, previousValues) {
  return (
    previousValues.filter((value, idx) => value === currentValues[idx]).length !==
    currentValues.length
  );
}

function hasPathMatched(validationPath, path) {
  return path === validationPath || path === clearIndexes(validationPath);
}

/**
 * Perform validation over the form data based on the path provided
 */
export default function useFormFlowValidation(path) {
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
        ({ isValid, path: validationPath }) => !isValid && hasPathMatched(validationPath, path)
      );
    },
    [allValidations, path]
  );
  const validate = useCallback(
    dataToValidate => {
      if (!path) {
        return [];
      }

      const validationRules = schemaData[path] || schemaData[clearIndexes(path)];

      if (!validationRules) {
        return [];
      }

      const value = get(dataToValidate, path);
      const values = (validationRules.invalidationPaths || []).map(invalidationPath =>
        get(dataToValidate, invalidationPath)
      );
      values.push(value);

      const hasBeenInvalidatedByDependencies = hasChanged(
        values,
        localCacheRef.current.previousValues
      );

      if (hasBeenInvalidatedByDependencies) {
        localCacheRef.current.validations = validationRules.validate({
          data: dataToValidate,
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
