import ValidationArgs from './ValidationArgs';

interface Validation extends ValidationArgs {
  isValid: boolean;
  message?: any;
}

export default Validation;
