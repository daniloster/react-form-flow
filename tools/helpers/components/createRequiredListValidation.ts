import ValidationProcessor from '../../../src/SchemaBuilder/ValidationProcessor';
import hasValue from './hasValue';

export default function createRequiredListValidation(message): ValidationProcessor {
  return ({ data, value, path, ...others }) => {
    const key = `${path}-required`;
    const isValid = hasValue(value) && value.length > 0;

    return { ...others, data, value, path, key, isValid, message };
  };
}
