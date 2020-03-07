import createRequiredValidation from '../react-form-flow-examples/validationRecipes/createRequiredValidation';
import getInvalidationRules from '../src/getInvalidationRules';
import { createValidations } from '../src/validationUtils';

const schema = {
  'contacts[].name': createValidations(
    ['contacts[$0].type'],
    createRequiredValidation('Contact name is required')
  ),
  name: createValidations(
    ['contacts[0]'],
    createRequiredValidation('Name is required')
  )
}

describe('getInvalidationRules', () => {
  test('getInvalidationRules gets invalidation rules for all variants', () => {
    const invalidationRules = getInvalidationRules(schema)
    expect(invalidationRules).toEqual({
      'contacts[$0].type': [
        'contacts[].name',
      ],
      'contacts[0]': [
        'name',
      ],
      'contacts[]': [
        'name',
      ],
      'contacts[].name': [
        'contacts[].name',
      ],
      'contacts[].type': [
        'contacts[$0].name',
      ],
      name: [
        'name',
      ],
    })
  });
});
