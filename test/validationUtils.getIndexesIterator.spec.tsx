import { getIndexesIterator } from '../src/validationUtils';

describe('Validation Utils - getIndexesIterator', () => {
  test('getIndexesIterator resolves "contacts[$1].values[$0]"', () => {
    expect(getIndexesIterator('contacts[$1].values[$0]')).toEqual(['$1', '$0']);
  });

  test('getIndexesIterator resolves "messages[$1]"', () => {
    expect(getIndexesIterator('messages[$2]')).toEqual(['', '', '$0']);
  });
});
