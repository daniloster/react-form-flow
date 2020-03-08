const EMPTY_LIST = [];
/**
 * Resolves the absolute path to a given invalidation path
 * @param {array<string>} ancestorsPathParts - e.g. "user.contacts[0].type" => ["user", "contacts[0]", "type"]
 * @param {*} invalidationPath - the invalidation path
 * @returns {string} the absolute path
 */
export default function getAbsolutePath(ancestorsPathParts, invalidationPath) {
  const matched = invalidationPath.match(/^(\$\.)*/)[0] || '';
  const totalAncestorTokens = matched.length / 2;
  const offsetEnd = ancestorsPathParts.length - totalAncestorTokens;
  const parentPath = (offsetEnd > -1 && !!matched
    ? ancestorsPathParts.slice(0, ancestorsPathParts.length - totalAncestorTokens).concat('')
    : EMPTY_LIST
  ).join('.');

  return invalidationPath.replace(matched, parentPath);
}
