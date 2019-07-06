import hasValue from './hasValue';

export default function createMaxLengthValidation(max, createMessage) {
  return args => {
    const { data, value, path } = args;
    const key = `${path}-max-length`;
    const isValid = !hasValue(value) || value.length <= max;
    const { length } = value || '';
    const message = createMessage({ data, value, path, max, length });

    return { data, value, path, key, isValid, message };
  };
}
