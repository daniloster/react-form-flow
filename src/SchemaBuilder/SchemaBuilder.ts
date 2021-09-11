import { createValidations } from '../validationUtils';
import AggregatedValidator from './AggregatedValidator';
import Builder, { BuilderNode } from './Builder';
import ExtraArguments from './ExtraArguments';
import factoryValidate from './factoryValidate';
import ResponseValidationProcessor from './ResponseValidationProcessor';
import ValidationArgs from './ValidationArgs';
import ValidationProcessor from './ValidationProcessor';
import ValidationProcessorChecker from './ValidationProcessorChecker';
import ValidationProcessorFactory from './ValidationProcessorFactory';
import wrapSchemaWithValidationMethods from './wrapSchemaWithValidationMethods';

const EMPTY_OBJECT = { response: undefined as any as ResponseValidationProcessor };
const DEFAULT_VALIDATION = "test" as const;
type ValidationMethodsMap = {
  [key: string]: ValidationProcessorFactory;
};
const validations: ValidationMethodsMap = {};

/**
 * Factories methods to build validations which will be available
 * later in the build schema process
 */
function factory<T extends Object>(validationName: string, isValid: ValidationProcessorChecker, defaultExtraArgs?: ExtraArguments) {
  if (validations[validationName] || validationName === DEFAULT_VALIDATION) {
    throw new Error(`The validation "${validationName}" already exists, you cannot override it.
Validations can be manipulated by get("${validationName}"), purge("${validationName}").`);
  }

  const factoryValidationInternal: ValidationProcessorFactory = (args: ValidationArgs): ValidationProcessor<T> => {
    const { response: __discard, ...extraArguments } = args || EMPTY_OBJECT;
    const response: ResponseValidationProcessor = args?.response || defaultExtraArgs?.response;
    const validate = factoryValidate(validationName, isValid, response);
    return (args: ValidationArgs & T) => validate({ name: validationName, ...args, ...extraArguments });
  };
  validations[validationName] = factoryValidationInternal;
}

/**
 * Creates a builder for validations
 */
function builder(): Builder {
  const schema: { [key: string]: AggregatedValidator } = {};
  const instance = {
    /**
     * Creates the schema
     * @returns {object}
     */
    build: () => wrapSchemaWithValidationMethods(schema),
    /**
     * Creates the schema
     */
    with: (path: string, invalidationPaths: string[] = []): BuilderNode => {
      const validationMethods: any[] = [];
      const newBuilder: BuilderNode = {
        check: undefined!,
        end: undefined!,
        test: (...args) => {
          validationMethods.push(factoryValidate(...args));
          return newBuilder;
        },
      };
      Object.entries(validations).forEach(([key, method]) => {
        if (!newBuilder[key]) {
          newBuilder[key] = ((...args: any[]) => {
            const [input, extra] = args as [ValidationArgs, ExtraArguments];
            validationMethods.push(method(input, extra));
            return newBuilder;
          }) as Function;
        }
      });
      /**
       * Finish validation to a path and returns to builder
       */
      function check<T>(validationName: string, extraArguments?: Partial<ExtraArguments> & T): BuilderNode {
        newBuilder[validationName as any](extraArguments);
        return newBuilder;
      }
      newBuilder.check = check;
      /**
       * Finish validation to a path and returns to builder
       */
      function end() {
        schema[path] = createValidations(invalidationPaths, ...validationMethods) as AggregatedValidator;
        return instance as any as Builder;
      }
      newBuilder.end = end;

      return newBuilder;
    },
  };

  return instance as any as Builder;
}

/**
 * Gets a list of validation names to be purged
 */
function getPurgedList(validationNames?: string | string[]): string[] {
  const isTryingToRemoveTest =
    validationNames === 'test' ||
    (validationNames &&
      (validationNames as string[]).some &&
      (validationNames as string[]).some((validationName: string) => validationName === 'test'));
  if (isTryingToRemoveTest) {
    throw new Error('"test" cannot be purged. It is a fundamental validation.');
  }

  if (Array.isArray(validationNames)) {
    return validationNames;
  }

  if (validationNames === undefined) {
    return Object.keys(validations).filter(validation => validation !== 'test');
  }

  if (typeof validationNames === 'string') {
    return [validationNames];
  }

  throw new Error('Argument "validationNames" can only be string, array or undefined.');
}

export default Object.freeze({
  /**
   * Initialize the builder for schema
   */
  builder,
  /**
   * Factory validations to accessed in the builder
   */
  factory,
  get: (validationName: string) => validationName === DEFAULT_VALIDATION ? factoryValidate : validations[validationName],
  /**
   * Purges validations
   */
  purge: (validationNames?: string|Array<string>): { [key: string]: ValidationProcessorFactory } => {
    const validationNamesToRemove = getPurgedList(validationNames);
    const removed: ValidationMethodsMap = {};
    validationNamesToRemove.forEach(validationName => {
      removed[validationName] = validations[validationName];
      delete validations[validationName];
    });

    return removed;
  },
});
