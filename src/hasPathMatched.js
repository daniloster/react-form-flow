import { clearIndexes } from './validationUtils';

/**
 * Checks if a validated path matches a given path
 * @param {string} validationPath the validated path
 * @param {string} path the path to compare against
 * @returns {boolean}
 */
export default function hasPathMatched(validationPath, path) {
  return !path || path === validationPath || path === clearIndexes(validationPath);
}
