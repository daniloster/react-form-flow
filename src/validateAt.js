import { get } from 'mutation-helper';
import { clearIndexes } from './validationUtils';

/**
 * Validates form data based on path, schema, and data provided
 * @param {string} path
 * @param {object} schemaData
 * @param {object} data
 * @returns {array<Validation>}
 */
export default function validateAt(path, schemaData, data) {
  const pathIndexesCleared = clearIndexes(path);
  const validationRules = schemaData[path] || schemaData[pathIndexesCleared];
  const value = get(data, path);

  return validationRules.validate({
    data,
    get,
    path,
    value,
  });
}
