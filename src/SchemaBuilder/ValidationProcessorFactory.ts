import ExtraArguments from './ExtraArguments';
import ValidationArgs from './ValidationArgs';
import ValidationProcessor from './ValidationProcessor';

interface ValidationProcessorFactory {
  (args: ValidationArgs): ValidationProcessor;
  <T = any>(args: ValidationArgs, extraArguments: ExtraArguments & T): ValidationProcessor<T>;
}

export default ValidationProcessorFactory;
