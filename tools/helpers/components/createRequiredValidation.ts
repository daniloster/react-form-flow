import ValidationProcessor from '../../../src/SchemaBuilder/ValidationProcessor';
import hasValue from './hasValue';

export default function createRequiredValidation(message: string): ValidationProcessor {
  return ({ data, value, path, ...others }) => {
    const key = `${path}-required`;
    const isValid = hasValue(value);

    return { ...others, data, value, path, key, isValid, message };
  };
}
