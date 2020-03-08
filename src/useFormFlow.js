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
      observableState.set(oldData => {
        const isTouched = get(oldData, `touched.${path}`);
        if (!isTouched) {
          return set(oldData, `touched.${path}`, true);
        }

        return oldData;
      });
    },
    [observableState]
  );
  const onChangeByPath = useCallback(
    (path, value) => {
      observableState.set(oldData => {
        const oldValue = get(oldData, `values.${path}`);
        const isDirtyOld = get(oldData, `dirty.${path}`);
        const isDirty = (oldValue || '') !== value;
        if (oldValue === value && isDirtyOld === isDirty) {
          return oldData;
        }

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
