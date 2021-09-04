import { get } from '../../src/accessor';
import SchemaBuilder from '../../src/SchemaBuilder';

describe('SchemaBuilder', () => {
  beforeEach(() => {
    SchemaBuilder.purge();
  });

  describe('SchemaBuilder allow access to manage validations', () => {
    test('if SchemaBuilder allow get the validation', () => {
      expect(SchemaBuilder.get('test')).toBeInstanceOf(Function);
    });
    test('if SchemaBuilder throws error for purging test', () => {
      try {
        SchemaBuilder.purge('test');
        expect(true).toBeFalsy();
      } catch (e) {
        expect(true).toBeTruthy();
        expect(e.message).toEqual('"test" cannot be purged. It is a fundamental validation.');
      }
    });
    test('if SchemaBuilder purges list', () => {
      const expectedValidationsToBePurged = {
        val1: () => true,
        val2: () => true,
      };
      SchemaBuilder.factory('val1', expectedValidationsToBePurged.val1);
      SchemaBuilder.factory('val2', expectedValidationsToBePurged.val2);
      expect(SchemaBuilder.purge(['val1', 'val2'])).toEqual({
        val1: expect.any(Function),
        val2: expect.any(Function),
      });
    });
    test('if SchemaBuilder purges one validation', () => {
      SchemaBuilder.factory('val1', () => true);
      expect(SchemaBuilder.purge('val1')).toEqual({
        val1: expect.any(Function),
      });
    });
    test('if SchemaBuilder throw error other cases', () => {
      SchemaBuilder.factory(1, () => true);
      try {
        SchemaBuilder.purge(1);
        expect(true).toBeFalsy();
      } catch (e) {
        expect(true).toBeTruthy();
        expect(e.message).toEqual(
          'Argument "validationNames" can only be string, array or undefined.'
        );
        // if factory is forced with non-string, it will parse to string, so purging
        // correctly can be done with string version of the non-string key
        SchemaBuilder.purge("1");
        expect(true).toBeTruthy();
      }
    });
  });

  describe('SchemaBuilder factories validation with extra params', () => {
    beforeEach(() => {
      SchemaBuilder.factory<{ optional: boolean }>('string', ({ optional, value }) => {
        if (optional && (value === undefined || value === null)) {
          return true;
        }

        return typeof value === 'string';
      });
    });

    test('if SchemaBuilder does allow devs to override validation', () => {
      try {
        SchemaBuilder.factory('test', () => true);
        expect(true).toBeFalsy();
      } catch (e) {
        expect(true).toBeTruthy();
        expect(e.message).toEqual(
          'The validation "test" already exists, you cannot override it.\nValidations can be manipulated by get("test"), purge("test").'
        );
      }
    });

    test('if SchemaBuilder allows devs to execute validation for scenario A', () => {
      const schema = SchemaBuilder.builder()
        .with("name")
        .check('string', { optional: false })
        .end()
        .build();

      expect(schema.validate({ name: 'FormFlow' })).toEqual({
        allPaths: ['name'],
        allValidations: [
          {
            data: {
              name: 'FormFlow',
            },
            dependencies: [],
            get,
            isValid: true,
            name: 'string',
            optional: false,
            key: 'name.errors.string',
            path: 'name',
            value: 'FormFlow',
          },
        ],
        byPath: {
          name: [
            {
              data: {
                name: 'FormFlow',
              },
              dependencies: [],
              get,
              isValid: true,
              name: 'string',
              optional: false,
              key: 'name.errors.string',
              path: 'name',
              value: 'FormFlow',
            },
          ],
        },
      });
    });

    test('if SchemaBuilder allows devs to execute validation for scenario B', () => {
      const schema = SchemaBuilder.builder()
        .with('name')
        .check('string', { optional: true })
        .end()
        .build();

      expect(schema.validate({})).toEqual({
        allPaths: ['name'],
        allValidations: [
          {
            data: {},
            dependencies: [],
            get,
            isValid: true,
            name: 'string',
            optional: true,
            key: 'name.errors.string',
            path: 'name',
            value: undefined,
          },
        ],
        byPath: {
          name: [
            {
              data: {},
              dependencies: [],
              get,
              isValid: true,
              name: 'string',
              optional: true,
              key: 'name.errors.string',
              path: 'name',
              value: undefined,
            },
          ],
        },
      });
    });
  });
});
