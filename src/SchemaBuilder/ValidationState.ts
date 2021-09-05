import Validation from './Validation';

interface ValidationState {
  allPaths: string[];
  allValidations: Validation[];
  byPath: {
    [key: string]: Validation[];
  };
}

export default ValidationState;
