import { useCallback, useContext, useMemo } from 'react';
import { get } from './accessor';
import FormFlowDataContext from './FormFlowDataContext';
import FormFlowDataType from './FormFlowDataType';
import { useObservableState } from './react-state';
import Validation from './SchemaBuilder/Validation';
import useFormFlow from './useFormFlow';
import useFormFlowValidation from './useFormFlowValidation';

export type FormFlowItem<T = any> = {
  data: Object;
  dirty: boolean;
  onBlur: (e: Event) => void;
  onChange?: (e: Event) => void;
  onChangeValue?: (value: any) => void;
  setData: (transformer: (v: FormFlowDataType) => FormFlowDataType) => void;
  submitted: boolean;
  touched: boolean;
  validations: Validation[];
  value: T;
};

/**
 * Obtains values and validation from a form based on a json path
 */
export default function useFormFlowItem<T = any>(path?: string): FormFlowItem<T> {
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
