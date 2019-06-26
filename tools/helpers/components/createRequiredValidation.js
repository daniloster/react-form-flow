import hasValue from './hasValue';

export default function createRequiredValidation(message) {
  return ({ data, value, path }) => {
    const key = `${path}-required`;
    const isValid = hasValue(value);

    return { data, value, path, key, isValid, message };
  };
}
