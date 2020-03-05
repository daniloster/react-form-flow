export default function getMapByKeys(map, keys) {
  const newMap = {};
  keys.forEach(key => {
    newMap[key] = map[key];
  });

  return newMap;
}
