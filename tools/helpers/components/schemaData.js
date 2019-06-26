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
  description: createValidations(
    [],
    createRequiredValidation('Description is required!'),
    createMinLengthValidation(
      300,
      ({ length, min }) =>
        `Description should have more than ${min} characters. (Remaining ${
          length > min ? 0 : min - length
        })`
    )
  ),
};
