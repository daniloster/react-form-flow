import { get } from 'mutation-helper';
import { useCallback, useContext, useMemo } from 'react';
import FormFlowDataContext from './FormFlowDataContext';
import { useObservableState } from './react-state';
import useFormFlow from './useFormFlow';
import useFormFlowValidation from './useFormFlowValidation';

/**
 * Obtains values and validation from a form based on a json path
 * @param {string} path the json path to get and set value as well as validate it
 * @returns {React.Context}
 */
export default function useFormFlowItem(path) {
  const observableState = useContext(FormFlowDataContext);
  const [metadata, setMetadata] = useObservableState(observableState);
  const { validations } = useFormFlowValidation(path);
  const { onChangeByPath } = useFormFlow();
  const data = metadata.values;
  const setData = useCallback(
    values => {
      setMetadata(oldMetadata => ({
        ...oldMetadata,
        values,
      }));
    },
    [setMetadata]
  );
  const onChangeValue = useCallback(
    value => {
      onChangeByPath(path, value);
    },
    [path, onChangeByPath]
  );
  const onChange = useCallback(
    e => {
      onChangeByPath(path, e.target.value);
    },
    [path, onChangeByPath]
  );
  const value = useMemo(() => (path ? get(data, path) : data), [data, path]);

  return {
    data,
    onChangeValue,
    onChange,
    setData,
    validations,
    value,
  };
}
