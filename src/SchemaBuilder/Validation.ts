import ValidationArgs from './ValidationArgs';

interface Validation extends ValidationArgs {
  isValid: boolean;
  name: string;
  key: string;
}

export default Validation;
