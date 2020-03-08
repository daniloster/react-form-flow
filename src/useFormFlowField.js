import { useCallback, useMemo } from 'react';
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

/**
 * @typedef MetadataField
 * @property {Function(Event)} onBlur - if returns false, it stops the effect
 * @property {Function(Event)} onChange - if returns false, it stops the effect
 * @property {Function(any)} onChangeValue - if returns false, it stops the effect
 * @property {string} type - this can be either 'event' or 'value'
 */

/**
 * Obtains values and validation from a form based on a json path
 * @param {string} path the json path to get and set value as well as validate it
 * @param {MetadataField} options the interceptors for events
 * @returns {{ field: object, errors: Array }}
 */
export default function useFormFlowField(path, options) {
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
      changeForm(e);
    },
    [change, changeForm]
  );
  const onChangeValue = useCallback(
    val => {
      changeValue(val);
      changeValueForm(val);
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
