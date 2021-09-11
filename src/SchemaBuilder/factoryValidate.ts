import ResponseValidationProcessor from './ResponseValidationProcessor';
import Validation from './Validation';
import ValidationArgs from './ValidationArgs';
import ValidationProcessor from './ValidationProcessor';
import ValidationProcessorChecker from './ValidationProcessorChecker';

// function defaultResponse(args: ValidationArgs, validationName: string): Partial<Validation> {
function defaultResponse(): Partial<Validation> {
  return {};
}

export default function factoryValidate(
  validationName: string,
  isValid: ValidationProcessorChecker,
  response?: ResponseValidationProcessor
): ValidationProcessor {
  return (args: ValidationArgs) => (({
    ...args,
    isValid: isValid(args),
    name: validationName,
    key: `${args.path}.errors.${validationName}`.replace(/\[\d*\]/g, ''),
    ...(response || defaultResponse)(args),
  }) as Validation);
}
