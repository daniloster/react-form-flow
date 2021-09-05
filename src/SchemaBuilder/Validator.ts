import Validation from './Validation';
import ValidationResult from './ValidationResult';

interface Validator {
  validate(data: Object): ValidationResult;
  validateAt(data: Object, path: string): Array<Validation>;
}

export default Validator;
