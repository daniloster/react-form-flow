import hasValue from './hasValue';

export default function createRequiredListValidation(message) {
  return ({ data, value, path }) => {
    const key = `${path}-required`;
    const isValid = hasValue(value) && value.length > 0;

    return { data, value, path, key, isValid, message };
  };
}
