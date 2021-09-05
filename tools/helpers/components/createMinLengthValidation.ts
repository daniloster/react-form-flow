import ValidationProcessor from '../../../src/SchemaBuilder/ValidationProcessor';
import hasValue from './hasValue';

export default function createMinLengthValidation(min, createMessage): ValidationProcessor {
  return args => {
    const { data, value, path, ...others } = args;
    const key = `${path}-min-length`;
    const isValid = !hasValue(value) || value.length >= min;
    const { length } = value || '';
    const message = createMessage({ data, value, path, min, length });

    return { ...others, data, value, path, key, isValid, message };
  };
}
