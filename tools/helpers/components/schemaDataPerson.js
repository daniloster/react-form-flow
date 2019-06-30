import { createValidations } from '../../../src';
import createRequiredValidation from './createRequiredValidation';
import createMinLengthValidation from './createMinLengthValidation';

export default {
  name: createValidations(
    [],
    createRequiredValidation('Name is required!'),
    createMinLengthValidation(
      5,
      ({ length, min }) =>
        `Name should have more than ${min} characters. (Remaining ${
          length > min ? 0 : min - length
        })`
    )
  ),
  age: createValidations(
    ['name'],
    createRequiredValidation('Age is required!'),
    ({ data, get, path, value }) => {
      const name = get(data, 'name');
      const isAgeRequiredBeyond15 = ['John', 'Mary'].includes(name);
      const key = `${path}-limits`;
      const isValid = !isAgeRequiredBeyond15 || Number(value) > 15;
      const message = `The age for "${name}" is supposed to be beyond 15`;

      return { data, isValid, key, path, value, message };
    }
  ),
};
