import { interpolatePaths } from '../src/validationUtils';

describe('Validation Utils', () => {
  describe('interpolatePaths derives all possible paths to the given schemaData and data', () => {
    let paths;
    const schemaData = {
      firstname: {},
      lastname: {},
      'contacts[].name': {},
      'contacts[].value': {},
      'children[].name': {},
      'children[].contacts[].name': {},
      'children[].contacts[].value': {},
      'children[].achievements[].name': {},
      'children[].achievements[].classification': {},
    };
    const data = {
      firstname: 'Jane',
      lastname: 'Doe',
      contacts: [
        {
          name: 'Mom',
          type: 'email',
          value: 'mom@email.com',
        },
        {
          name: 'Dad',
          type: 'email',
          value: 'dad@email.com',
        },
      ],
      children: [
        {
          name: 'Jane 1',
          contacts: [
            {
              name: 'Cousin 1',
              type: 'email',
              value: 'cousin1@email.com',
            },
            {
              name: 'Cousin 2',
              type: 'email',
              value: 'cousin2@email.com',
            },
          ],
          achievements: [
            {
              name: 'Swimming challenge',
              classification: 'winner',
            },
            {
              name: 'Marathon challenge',
              classification: '3rd',
            },
          ],
        },
        {
          name: 'John 1',
          contacts: [
            {
              name: 'Cousin 1',
              type: 'email',
              value: 'cousin1@email.com',
            },
            {
              name: 'Cousin 2',
              type: 'email',
              value: 'cousin2@email.com',
            },
          ],
          achievements: [
            {
              name: 'Swimming challenge',
              classification: '2nd',
            },
            {
              name: 'Marathon challenge',
              classification: 'winner',
            },
          ],
        },
      ],
    };
    it('Given interpolatePaths is executed for single array notation', () => {
      paths = interpolatePaths(schemaData, data);
    });
    it('Expect to have all paths available', () => {
      expect(paths).toEqual([
        'firstname',
        'lastname',
        'contacts',
        'contacts[0].name',
        'contacts[1].name',
        'contacts[0].value',
        'contacts[1].value',
        'children',
        'children[0].name',
        'children[1].name',
        'children[0].contacts[0].name',
        'children[0].contacts[1].name',
        'children[1].contacts[0].name',
        'children[1].contacts[1].name',
        'children[0].contacts[0].value',
        'children[0].contacts[1].value',
        'children[1].contacts[0].value',
        'children[1].contacts[1].value',
        'children[0].achievements[0].name',
        'children[0].achievements[1].name',
        'children[1].achievements[0].name',
        'children[1].achievements[1].name',
        'children[0].achievements[0].classification',
        'children[0].achievements[1].classification',
        'children[1].achievements[0].classification',
        'children[1].achievements[1].classification',
      ]);
    });
  });
});
