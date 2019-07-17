import hasChanged from '../src/hasChanged';

describe('hasChanged', () => {
  describe('hasChanged detects the some of the values has changed', () => {
    let isChanged;
    it('Given hasChanged is executed for two arrays with the same size differing on one element', () => {
      isChanged = hasChanged(
        [1, 2, 3, 'some', 32, 'phone', 45],
        [1, 2, 3, 'some-1', 32, 'phone', 45]
      );
    });
    it('Expect to notice the array has changed', () => {
      expect(isChanged).toBe(true);
    });
  });

  describe('hasChanged detects the values are untouched', () => {
    let isChanged;
    it('Given hasChanged is executed for two arrays with the same content', () => {
      isChanged = hasChanged(
        [1, 2, 3, 'some', 32, 'phone', 45],
        [1, 2, 3, 'some', 32, 'phone', 45]
      );
    });
    it('Expect to notice the array is the same', () => {
      expect(isChanged).toBe(false);
    });
  });
});
