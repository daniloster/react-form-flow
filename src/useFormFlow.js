import { get, set } from 'mutation-helper';
import { useCallback, useContext } from 'react';
import FormFlowDataContext from './FormFlowDataContext';

/**
 * Creates a memoized Provider component to be used as form
 * @returns {React.Context}
 */
export default function useFormFlow() {
  const observableState = useContext(FormFlowDataContext);
  const onBlurByPath = useCallback(
    path => {
      observableState.set(oldData => set(oldData, `touched.${path}`, true));
    },
    [observableState]
  );
  const onChangeByPath = useCallback(
    (path, value) => {
      observableState.set(oldData => {
        const isDirty = (get(oldData, `values.${path}`) || '') !== value;
        return set(set(oldData, `dirty.${path}`, isDirty), `values.${path}`, value);
      });
    },
    [observableState]
  );

  return {
    data: observableState.get(),
    onBlurByPath,
    onChangeByPath,
    setData: observableState.set,
  };
}
