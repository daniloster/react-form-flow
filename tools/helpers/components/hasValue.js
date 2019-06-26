export default function hasValue(value) {
  return (
    value !== null && value !== undefined && (typeof value !== 'string' || (value && value.trim()))
  );
}
