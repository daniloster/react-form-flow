import { useCallback, useMemo } from 'react';
import Validation from './SchemaBuilder/Validation';
import useFormFlowItem from './useFormFlowItem';

const Types = {
  Event: 'event',
  Value: 'value',
};
const DEFAULT_OPTIONS = {
  onBlur: () => true,
  onChange: () => true,
  onChangeValue: () => true,
  eventType: Types.Event,
};

export type MetadataField = {
  onBlur?: <T>(e: T) => void;
  onChange?: <T>(e: T) => void;
  onChangeValue?: (value: any) => void;
  eventType?: 'event' | 'value';
};

export type Field = {
  onBlur?: <T>(e: T) => void;
  onChange?: <T>(e: T) => void;
  onChangeValue?: (value: any) => void;
  value: any;
};

export type FormFlowField = {
  dirty: boolean;
  errors: Validation[];
  field: Field;
  submitted: boolean;
  touched: boolean;
};

function useFormFlowField(path: string): FormFlowField;
function useFormFlowField(path: string, options: MetadataField): FormFlowField
/**
 * Obtains values and validation from a form based on a json path
 * @returns {{ field: object, errors: Array }}
 */
function useFormFlowField(path: string, options?: MetadataField): FormFlowField {
  const { dirty, value, validations, submitted, touched, ...metadata } = useFormFlowItem(path);
  const metadataOptions = {
    ...DEFAULT_OPTIONS,
    ...(options || DEFAULT_OPTIONS),
  };
  const blur = metadataOptions.onBlur;
  const change = metadataOptions.onChange;
  const changeValue = metadataOptions.onChangeValue;
  const blurForm = metadata.onBlur;
  const changeForm = metadata.onChange;
  const changeValueForm = metadata.onChangeValue;

  const onBlur = useCallback(
    e => {
      blur(e);
      blurForm(e);
    },
    [blur, blurForm]
  );
  const onChange = useCallback(
    e => {
      change(e);
      if (changeForm) changeForm(e);
    },
    [change, changeForm]
  );
  const onChangeValue = useCallback(
    val => {
      changeValue(val);
      if (changeValueForm) changeValueForm(val);
    },
    [changeValue, changeValueForm]
  );
  const errors = useMemo(() => validations.filter(({ isValid }) => !isValid), [validations]);
  const field =
    metadataOptions.eventType === Types.Event
      ? { onBlur, onChange, value }
      : { onBlur, onChangeValue, value };

  return { dirty, errors, field, submitted, touched };
}

export { useFormFlowField };
export default useFormFlowField;
