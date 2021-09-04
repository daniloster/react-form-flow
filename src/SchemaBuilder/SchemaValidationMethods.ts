import Validation from './Validation';
import ValidationState from './ValidationState';

interface SchemaValidationMethods {
  validate(data: Object): ValidationState;
  validateAt: (data: Object, path: string) => Validation[];
}

export default SchemaValidationMethods;
