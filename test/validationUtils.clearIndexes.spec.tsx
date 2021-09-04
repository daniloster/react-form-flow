import { clearIndexes } from '../src/validationUtils';

describe('Validation Utils', () => {
  describe('clearIndexes removes index from jsonPath', () => {
    let clearedPath;
    it('Given clearIndexes is executed for single array notation', () => {
      clearedPath = clearIndexes('addressBook.contacts[10].name');
    });
    it('Expect to not see index in the array', () => {
      expect(clearedPath).toBe('addressBook.contacts[].name');
    });
  });

  describe('clearIndexes removes multiple indexes from jsonPath', () => {
    let clearedPath;
    it('Given clearIndexes is executed for multiple arrays notation', () => {
      clearedPath = clearIndexes('addressBook.contacts[10].types[2].name');
    });
    it('Expect to not see indexes in the arrays', () => {
      expect(clearedPath).toBe('addressBook.contacts[].types[].name');
    });
  });
});
