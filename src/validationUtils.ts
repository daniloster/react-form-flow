import { get } from './accessor';
import AggregatedValidator from './SchemaBuilder/AggregatedValidator';
import Validation from './SchemaBuilder/Validation';
import ValidationArgs from './SchemaBuilder/ValidationArgs';
import ValidationProcessor from './SchemaBuilder/ValidationProcessor';

/**
 * Removes the index number from array notations
 */
export function clearIndexes(path: string): string {
  return path.replace(/\[\d+\]/g, '[]');
}

/**
 * Removes the index number preceeded of '$' from array notations
 */
export function clearIndexesIterator(path: string): string {
  return path.replace(/\[\$\d+\]/g, '[]');
}

/**
 * Gets the index of iterator for array notation
 * e.g.  contacts[].types[] => contacts[$1].values[$0] => [1, 4]
 * e.g.  contacts[].values[] => messages[$1] => [1]
 * @param {string} path
 * @returns {array<number>}
 */
export function getIndexesIterator(path: string): string[] {
  const indexesMatches = (path.match(/\[\$(\d+)\]/g) || [])
    .slice()
    // eslint-disable-next-line
    .map(text => Number(text.replace(/[\[\]$]/g, '')));
  const length = Math.max(...indexesMatches, 0) + 1;
  const iterators: string[] = Array.from({ length }).map((_, index) => {
    const reverseIndex = indexesMatches.indexOf(index);
    return reverseIndex > -1 ? `$${reverseIndex}` : '';
  });
  return iterators;
}

/**
 * Adds item to list if list does not contain it.
 * (mutates the list)
 * @param {array} list
 * @param {any} item
 * @returns {void}
 */
function add<T>(list: T[], item: T) {
  if (!list.includes(item)) {
    list.push(item);
  }
}

/**
 * Creates list of paths based on data, prefix and remainingPaths.
 * (mutates the paths)
 */
function derivatePaths(
  paths: string[],
  data: Object,
  prefix: string | undefined,
  remainingPaths: string[]
): void {
  if (remainingPaths.length === 0) {
    add(paths, prefix);
  }

  const list = prefix ? get(data, prefix) : data;
  const suffix = remainingPaths.pop();

  if (list && list.forEach) {
    list.forEach((_: any, idx: number) => {
      derivatePaths(paths, data, `${prefix}[${idx}]${suffix}`, remainingPaths.slice());
    });
  }
}

export function interpolatePathsByPaths(rawValidationPaths: string[], data: Object) {
  const paths: string[] = [];

  rawValidationPaths.forEach(jsonPath => {
    const rawJsonPath = clearIndexes(jsonPath);
    const nestedPaths = rawJsonPath
      .split('[]')
      .map(value => value.trim())
      .reverse();
    const parentPath = nestedPaths.pop();

    if (parentPath) {
      add(paths, parentPath);
    }

    if (nestedPaths.length > 0) {
      derivatePaths(paths, data, parentPath, nestedPaths);
    }
  });

  return paths;
}

/**
 * Creates a list of json paths based on the existing keys in the schema
 * and the data.
 */
export function interpolatePaths(schemaData: Object, data: Object): string[] {
  const rawValidationPaths = Object.keys(schemaData);
  return interpolatePathsByPaths(rawValidationPaths, data);
}

/**
 * Creates validator based on invalidationPaths and list of validations.
 */
export function createValidations(
  invalidationPaths: string[],
  ...validations: ValidationProcessor[]
): AggregatedValidator {
  function validate(args: ValidationArgs): Validation[] {
    return validations.map(checkValidation => checkValidation(args));
  }

  return {
    invalidationPaths,
    validate,
  };
}
