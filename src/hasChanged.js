/**
 * Identifies if any of the values in the arrays has changed
 * @param {array} currentValues the current list of values to be compared
 * @param {array} previousValues the previous list of values to be compared
 * @returns {boolean}
 */
export default function hasChanged(currentValues, previousValues) {
  return (
    previousValues.filter((value, idx) => value === currentValues[idx]).length !==
    currentValues.length
  );
}
