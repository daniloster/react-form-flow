import { set } from 'mutation-helper';
import { useCallback, useContext } from 'react';
import FormFlowDataContext from './FormFlowDataContext';
import FormFlowValidationContext from './FormFlowValidationContext';
import updateValidationsByTriggerJsonPath from './updateValidationsByTriggerJsonPath';

/**
 * Creates a memoized Provider component to be used as form
 * @returns {React.Context}
 */
export default function useFormFlow() {
  const observableStateValidation = useContext(FormFlowValidationContext);
  const observableState = useContext(FormFlowDataContext);
  const onChangeByPath = useCallback(
    (path, value) => {
      observableState.set(oldData => {
        const newData = set(oldData, `values.${path}`, value);
        updateValidationsByTriggerJsonPath(observableStateValidation, newData.values, path);
        return newData;
      });
    },
    [observableState, observableStateValidation]
  );

  return {
    data: observableState.get(),
    onChangeByPath,
    setData: observableState.set,
  };
}
