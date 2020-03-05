import { useCallback, useContext } from 'react';
import FormFlowDataContext from './FormFlowDataContext';
import FormFlowValidationContext from './FormFlowValidationContext';
import isValidByPaths from './isValidByPaths';
import { useObservableState } from './react-state';
import { clearIndexes } from './validationUtils';

const EMPTY_LIST = [];
/**
 * Perform validation over the form data based on the path provided
 */
export default function useFormFlowValidation(path = '') {
  const observableState = useContext(FormFlowDataContext);
  const [metadata] = useObservableState(observableState);
  const data = metadata.values;
  const observableStateValidation = useContext(FormFlowValidationContext);
  const [{ allValidations, byPath }] = useObservableState(observableStateValidation);
  const validations = path
    ? byPath[path] || byPath[clearIndexes(path)] || EMPTY_LIST
    : allValidations;
  const isAllValid = useCallback(paths => isValidByPaths(allValidations, paths), [allValidations]);

  return {
    data,
    isAllValid,
    validations,
  };
}
