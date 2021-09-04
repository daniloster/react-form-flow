import ValidationProcessor from '../../../src/SchemaBuilder/ValidationProcessor';
import hasValue from './hasValue';

export default function createMaxLengthValidation(max, createMessage): ValidationProcessor {
  return args => {
    const { data, value, path, ...others } = args;
    const key = `${path}-max-length`;
    const isValid = !hasValue(value) || value.length <= max;
    const { length } = value || '';
    const message = createMessage({ data, value, path, max, length });

    return { ...others, data, value, path, key, isValid, message };
  };
}
