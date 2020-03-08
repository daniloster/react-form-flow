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
  const { validations, touched, dirty, submitted } = useFormFlowValidation(path);
  const { onChangeByPath, onBlurByPath } = useFormFlow();
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
  const onBlur = useCallback(() => {
    onBlurByPath(path);
  }, [onBlurByPath, path]);
  const onChange = useCallback(
    e => {
      onChangeByPath(path, e.target.value);
    },
    [onChangeByPath, path]
  );
  const value = useMemo(() => (path ? get(data, path) : data), [data, path]);

  return {
    data,
    dirty,
    onBlur,
    onChangeValue,
    onChange,
    setData,
    submitted,
    touched,
    validations,
    value,
  };
}
