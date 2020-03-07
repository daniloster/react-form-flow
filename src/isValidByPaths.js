import hasPathMatched from './hasPathMatched';

const EMPTY_LIST = [];

export default function isValidByPaths(allValidations, paths) {
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
