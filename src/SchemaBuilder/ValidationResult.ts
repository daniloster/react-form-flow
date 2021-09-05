import Validation from './Validation';

export interface ValidationResult {
  allValidations: Array<Validation>;
  byPath: Record<string, Validation>;
}

export default ValidationResult;
