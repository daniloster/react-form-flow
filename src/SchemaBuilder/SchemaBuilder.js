import { createValidations } from '../validationUtils';
import test from './test';
import wrapSchemaWithValidationMethods from './wrapSchemaWithValidationMethods';

const EMPTY_OBJECT = {};

const validations = {
  test,
};

/**
 * Factories methods to build validations which will be available
 * later in the build schema process
 * @param {string} validationName
 * @param {import('./types').ValidationProcessorChecker} isValid
 * @returns {void}
 */
function factoryValidation(validationName, isValid) {
  if (validations[validationName]) {
    throw new Error(`The validation "${validationName}" already exists, you cannot override it.
Validations can be manipulated by get("${validationName}"), purge("${validationName}").`);
  }

  validations[validationName] = ({ response, ...extraArgs } = EMPTY_OBJECT) => {
    const validate = test(validationName, isValid, response);
    return args => validate({ ...args, ...extraArgs });
  };
}

/**
 * Creates a builder for validations
 * @param {object} schema
 * @returns {import("./types").Builder}
 */
function schemaBuilder() {
  const schema = {};
  const builder = {
    /**
     * Creates the schema
     * @returns {object}
     */
    build: () => wrapSchemaWithValidationMethods(schema),
    /**
     * Creates the schema
     * @params {string} path
     * @params {string} invalidationPaths
     * @returns {import("./types").BuilderNode}
     */
    with: (path, invalidationPaths = []) => {
      const validationMethods = [];
      const newBuilder = {};
      Object.entries(validations).forEach(([key, method]) => {
        newBuilder[key] = (...args) => {
          validationMethods.push(method(...args));
          return newBuilder;
        };
      });
      /**
       * Finish validation to a path and returns to builder
       * @params {string} validationName
       * @params {Object} extraArgs
       * @returns {import("./types").BuilderNode}
       */
      function check(validationName, extraArgs) {
        newBuilder[validationName](extraArgs);
        return newBuilder;
      }
      newBuilder.check = check;
      /**
       * Finish validation to a path and returns to builder
       * @returns {import("./types").Builder}
       */
      function end() {
        schema[path] = createValidations(invalidationPaths, ...validationMethods);
        return builder;
      }
      newBuilder.end = end;

      return newBuilder;
    },
  };

  return builder;
}

/**
 * Gets a list of validation names to be purged
 * @param {string|Array<string>} validationNames
 * @returns {Array<string>}
 */
function getPurgedList(validationNames) {
  const isTryingToRemoveTest =
    validationNames === 'test' ||
    (validationNames &&
      validationNames.some &&
      validationNames.some(validationName => validationName === 'test'));
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
  builder: schemaBuilder,
  /**
   * Factory validations to accessed in the builder
   */
  factory: factoryValidation,
  get: validationName => validations[validationName],
  /**
   * Purges validations
   * @param {string|Array<string>} validationNames
   * @returns {{ [string]: import('./types').ValidationProcessorFactory }}
   */
  purge: validationNames => {
    const validationNamesToRemove = getPurgedList(validationNames);
    const removed = {};
    validationNamesToRemove.forEach(validationName => {
      removed[validationName] = validations[validationName];
      delete validations[validationName];
    });

    return removed;
  },
});
