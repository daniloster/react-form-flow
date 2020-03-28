export function pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
  return (propertyNames || Object.keys(o)).map(n => o[n]);
}

export interface Dictionary<T> {
  [key: string]: T;
}

export interface ValidationArgs {
  /**
   * The whole data form
   */
  data: object;
  /**
   * The path to be validated
   */
  path: string;
  /**
   * The value related to the path in the form
   */
  value: any;
  /**
   * The dependency values for conditionals
   */
  dependencies: Array<any>;
  /**
   * Method to get value given a form data and json path
   * @param data - the form data
   * @param path - the json path
   * @returns {any}
   */
  get(data: object, path: string): any;
}

export interface ResponseValidationProcessor {
    (args: ValidationArgs): object;
}

export interface ValidationProcessor {
    (args: ValidationArgs): object;
}

export interface ValidationProcessorChecker {
    (args: ValidationArgs): Boolean;
}

export interface ValidationResult {
  allValidations: Array<Validation>;
  byPath: Record<string, Validation>;
}

export interface Validator {
  validate(data: Object): ValidationResult;
  validateAt(data: Object, path: string): Array<Validation>;
}

export interface ExtraArguments extends Dictionary<any> {
  response?(data): ResponseValidationProcessor;
}

export interface ValidationProcessorFactory {
    (name: string, extraArguments: ExtraArguments): ValidationProcessor;
}

export interface BuilderNode {
  test(validationName: string, isValid: ValidationProcessor, response: ResponseValidationProcessor): BuilderNode;
  check(validation: string, extraArguments: ExtraArguments): BuilderNode;
  end(): Builder;
}

export interface Builder {
  build(): object;
  factory(name, extraArguments): ValidationProcessorFactory;
  with(path: string, invalidationPaths: Array<string>): BuilderNode
}
