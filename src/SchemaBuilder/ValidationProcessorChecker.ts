import ValidationArgs from './ValidationArgs';

interface ValidationProcessorChecker {
  (args: ValidationArgs): Boolean;
}

export default ValidationProcessorChecker;
