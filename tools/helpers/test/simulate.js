export function change(element, value) {
  element.simulate('change', { target: { value } });
}

export function click(element) {
  element.simulate('click');
}
