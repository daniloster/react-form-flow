import { get } from 'mutation-helper';

/**
 * Removes the index number from array notations
 * @param {string} path
 * @returns {string}
 */
export function clearIndexes(path) {
  return path.replace(/\[\d+\]/g, '[]');
}

/**
 * Removes the index number preceeded of '$' from array notations
 * @param {string} path
 * @returns {string}
 */
export function clearIndexesIterator(path) {
  return path.replace(/\[\$\d+\]/g, '[]');
}

/**
 * Gets the index of iterator for array notation
 * e.g.  contacts[].types[] => contacts[$1].values[$0] => [1, 4]
 * e.g.  contacts[].values[] => messages[$1] => [1]
 * @param {string} path
 * @returns {array<number>}
 */
export function getIndexesIterator(path) {
  const indexesMatches = (path.match(/\[\$(\d+)\]/g) || [])
    .slice()
    // eslint-disable-next-line
    .map(text => Number(text.replace(/[\[\]$]/g, '')));
  const length = Math.max(...indexesMatches, 0) + 1;
  const iterators = Array.from({ length }).map((_, index) => {
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
function add(list, item) {
  if (!list.includes(item)) {
    list.push(item);
  }
}

/**
 * Creates list of paths based on data, prefix and remainingPaths.
 * (mutates the paths)
 */
function derivatePaths(paths, data, prefix, remainingPaths) {
  if (remainingPaths.length === 0) {
    add(paths, prefix);
  }

  const list = get(data, prefix);
  const suffix = remainingPaths.pop();

  if (list && list.forEach) {
    list.forEach((_, idx) => {
      derivatePaths(paths, data, `${prefix}[${idx}]${suffix}`, remainingPaths.slice());
    });
  }
}

export function interpolatePathsByPaths(rawValidationPaths, data) {
  const paths = [];

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
 * @param {object} schemaData
 * @param {object} data
 * @returns {array<string>}
 */
export function interpolatePaths(schemaData, data) {
  const rawValidationPaths = Object.keys(schemaData);
  return interpolatePathsByPaths(rawValidationPaths, data);
}

/**
 * @typedef Validation
 * @property {object} data
 * @property {boolean} isValid
 * @property {string} key
 * @property {any} message
 * @property {string} path
 * @property {any} value
 */

/**
 * @typedef ValidatorArgs
 * @property {object} data
 * @property {string} path
 * @property {any} value
 */

/**
 * @typedef Validator
 * @property {array<string>} invalidationPaths
 * @property {function(ValidatorArgs): Array<Validation>} validate
 */

/**
 * Creates validator based on invalidationPaths and list of validations.
 * @param {array<string>} invalidationPaths
 * @param {...function} validations
 * @returns {Validator}
 */
export function createValidations(invalidationPaths, ...validations) {
  function validate(args) {
    return validations.map(checkValidation => checkValidation(args));
  }

  return {
    invalidationPaths,
    validate,
  };
}
