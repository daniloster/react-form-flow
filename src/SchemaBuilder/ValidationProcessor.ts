import Validation from './Validation';
import ValidationArgs from './ValidationArgs';

interface ValidationProcessor<T = any> {
  (args: ValidationArgs & T): Validation;
}

export default ValidationProcessor;
