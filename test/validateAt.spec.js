import createRequiredValidation from '../react-form-flow-examples/validationRecipes/createRequiredValidation';
import validateAt from '../src/validateAt';
import { createValidations } from '../src/validationUtils';

const schema = {
  'contacts[].name': createValidations(
    [],
    createRequiredValidation('Contact name is required')
  ),
  name: createValidations(
    [],
    createRequiredValidation('Name is required')
  )
}

describe('validateAt', () => {
  test('validateAt consider array rule', () => {
    const validations = validateAt('contacts[0].name', schema, { contacts: [{ name: '' }, { name: '' }] })
    expect(validations).toEqual([
      {
        data: {
          contacts: [
            {
              name: '',
            },
            {
              name: '',
            },
          ],
        },
        isValid: '',
        key: 'contacts[0].name-required',
        message: 'Contact name is required',
        path: 'contacts[0].name',
        value: '',
      }
    ])
  });

  test('validateAt consider normal rule', () => {
    const validations = validateAt('name', schema, { name: '' })
    expect(validations).toEqual([
      {
        data: {
          name: '',
        },
        isValid: '',
        key: 'name-required',
        message: 'Name is required',
        path: 'name',
        value: '',
      }
    ])
  });
});
