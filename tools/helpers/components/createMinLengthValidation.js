import hasValue from './hasValue';

export default function createMinLengthValidation(min, createMessage) {
  return args => {
    const { data, value, path } = args;
    const key = `${path}-min-length`;
    const isValid = !hasValue(value) || value.length >= min;
    const { length } = value || '';
    const message = createMessage({ data, value, path, min, length });

    return { data, value, path, key, isValid, message };
  };
}
