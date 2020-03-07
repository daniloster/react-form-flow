import getInvalidationRules from './getInvalidationRules';
import validatePaths from './validatePaths';

export default function validate(schemaData, data) {
  return {
    invalidationRules: getInvalidationRules(schemaData),
    schemaData,
    ...validatePaths(schemaData, data, {}, null),
  };
}
