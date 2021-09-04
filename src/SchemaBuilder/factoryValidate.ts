import ResponseValidationProcessor from './ResponseValidationProcessor';
import Validation from './Validation';
import ValidationArgs from './ValidationArgs';
import ValidationProcessor from './ValidationProcessor';
import ValidationProcessorChecker from './ValidationProcessorChecker';

// function defaultResponse(args: ValidationArgs, validationName: string): Partial<Validation> {
function defaultResponse(args: ValidationArgs): Partial<Validation> {
  return { key: `${args.path}.errors.${args.name}`.replace(/\[\d*\]/g, '') };
}

export default function factoryValidate(
  validationName: string,
  isValid: ValidationProcessorChecker,
  response?: ResponseValidationProcessor
): ValidationProcessor {
  return (args: ValidationArgs) => (({
    ...args,
    isValid: isValid(args),
    ...(response || defaultResponse)({ ...args, anme: validationName }),
  }) as Validation);
}
