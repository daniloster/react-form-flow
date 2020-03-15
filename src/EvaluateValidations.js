import { get } from 'mutation-helper';
import React, { useContext, useMemo, useRef } from 'react';
import FormFlowDataContext from './FormFlowDataContext';
import getAbsolutePath from './getAbsolutePath';
import { useObservableState } from './react-state';
import { clearIndexes, interpolatePaths } from './validationUtils';

function EvaluateValidation({ data, path, schemaData, validationsState, value }) {
  const pathIndexesCleared = clearIndexes(path);
  const isArrayPath = pathIndexesCleared !== path;
  const { invalidationPaths, validate } = schemaData[path] || schemaData[pathIndexesCleared];
  const paths = useMemo(() => {
    const ancestorsPathParts = path.split('.');
    const indexesMatches = path.match(/(\[\d+\])/g);
    const indexes = indexesMatches ? indexesMatches.slice() : [];
    return [path].concat(invalidationPaths).map(invalidationPath => {
      const absolutePath = getAbsolutePath(ancestorsPathParts, invalidationPath);
      return indexes.reduce(
        (finalPath, indexValue, index) => finalPath.replace(`[$${index}]`, indexValue),
        absolutePath
      );
    });
  }, [path, invalidationPaths]);
  const previousDataRef = useRef(Array.from({ length: paths.length }).map(() => null));
  const newPreviousData = [];
  const previousValidationRef = useRef(null);
  const isChanged = paths.reduce((isOverallChanged, jsonPath, index) => {
    if (isOverallChanged) {
      return true;
    }
    newPreviousData.push(get(data, jsonPath));
    return newPreviousData[index] !== previousDataRef.current[index];
  }, false);
  /**
   * Computing validations and returning cache if the invalidations hasn't changed
   */
  const validations = useMemo(() => {
    if (!isChanged && previousValidationRef.current !== null) {
      return previousValidationRef.current;
    }
    return validate({ data, get, path, value });
  }, [data, isChanged, path, validate, value]);
  /**
   * Appending computed validations
   */
  const validationsStateChange = validationsState;
  validationsStateChange.byPath[path] = validations;
  validations.forEach(validation => {
    if (isArrayPath) {
      validationsStateChange.byPath[pathIndexesCleared] =
        validationsStateChange.byPath[pathIndexesCleared] || [];
      validationsStateChange.byPath[pathIndexesCleared].push(validation);
    }
    validationsStateChange.allValidations.push(validation);
  });
  previousValidationRef.current = validations;
  previousDataRef.current = newPreviousData;

  return null;
}

export default function EvaluateValidations() {
  const observableState = useContext(FormFlowDataContext);
  const [state] = useObservableState(observableState);
  const { schemaData, values: data } = state;
  const allPaths = interpolatePaths(schemaData, data);
  const { validationsState } = observableState.get();
  /**
   * Basically, we need to clear out the pre-existing validation as it can only
   * be trigger by data or schemaData changes which would invalidate the form validations.
   */
  validationsState.allPaths = allPaths;
  validationsState.allValidations = [];
  validationsState.byPath = {};

  return allPaths.map(path => (
    <EvaluateValidation
      key={path}
      data={data}
      path={path}
      schemaData={schemaData}
      validationsState={validationsState}
      value={get(data, path)}
    />
  ));
}
