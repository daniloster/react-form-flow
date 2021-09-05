import Validation from './Validation';
import ValidationArgs from './ValidationArgs';

interface AggregatedValidator {
  invalidationPaths: string[];
  validate(args: ValidationArgs): Validation[];
}

export default AggregatedValidator;
