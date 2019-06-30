import { useCallback, useMemo } from 'react';
import { get } from 'mutation-helper';
import useFormFlow from './useFormFlow';
import useFormFlowValidation from './useFormFlowValidation';

/**
 * Obtains values and validation from a form based on a json path
 * @param {string} path the json path to get and set value as well as validate it
 * @returns {React.Context}
 */
export default function useFormFlowItem(path) {
  const { data, onChangeByPath, setData } = useFormFlow();
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
  const { validations } = useFormFlowValidation(path);

  return {
    data,
    onChangeValue,
    onChange,
    setData,
    validations,
    value,
  };
}
