import ExtraArguments from './ExtraArguments';
import Validation from './Validation';
import ValidationArgs from './ValidationArgs';

interface ResponseValidationProcessor {
  (args: ValidationArgs): Partial<Validation>;
  (args: ValidationArgs, extraArguments: ExtraArguments): Partial<Validation>;
}

export default ResponseValidationProcessor;
