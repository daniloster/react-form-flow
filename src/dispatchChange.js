/**
 * Applies value to HTML element and triggers react change event
 * @param {HTMLElement} target - the HTML element to be changed
 * @param {any} value - the value to apply
 */
export default function dispatchChange(target, value) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(target),
    'value'
  ).set;
  nativeInputValueSetter.call(target, value);
  target.dispatchEvent(new Event('input', { bubbles: true }));
}
