import hasPathMatched from './hasPathMatched';
import Validation from './SchemaBuilder/Validation';

const EMPTY_LIST: string[] = [];

export default function isValidByPaths(allValidations: Validation[], paths?: string[]) {
  const allPaths = paths || EMPTY_LIST;
  const isAllRequired = allPaths.length === 0;

  if (isAllRequired) {
    return !allValidations.some(({ isValid }) => !isValid);
  }

  return !allValidations.some(
    ({ isValid, path: validationPath }) =>
      !isValid && allPaths.some(internalPath => hasPathMatched(validationPath, internalPath))
  );
}
