import React, { useCallback, useRef } from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import {
  FormFlowProvider,
  useFormFlowItem,
  createValidations,
  useFormFlowValidation,
} from '../src';
import DropdownField from '../tools/helpers/components/DropdownField';
import InputField from '../tools/helpers/components/InputField';
import schemaDataPerson from '../tools/helpers/components/schemaDataPerson';
import createRequiredValidation from '../tools/helpers/components/createRequiredValidation';
import createRequiredListValidation from '../tools/helpers/components/createRequiredListValidation';
import hasValue from '../tools/helpers/components/hasValue';
import Validation from '../tools/helpers/components/Validation';

function PersonForm() {
  const nameField = useFormFlowItem('name');
  const ageField = useFormFlowItem('age');

  return (
    <div>
      <InputField {...nameField} label="Name" />
      <InputField {...ageField} label="Age" />
    </div>
  );
}

function mountComponent(customProps = {}) {
  const { CustomChildren, ...otherProps } = customProps;
  const props = {
    initialData: {
      name: '',
      age: '',
    },
    schemaData: schemaDataPerson,
    ...customProps,
  };
  const Children = CustomChildren || PersonForm;

  let element;
  act(() => {
    element = mount(<FormFlowProvider children={<Children />} {...props} />);
  });

  return {
    element,
    props,
  };
}

describe('<FormFlowProvider />', () => {
  describe('FormFlowProvider give access to data and value of a json path by using useFormFlowItem', () => {
    let scenario;
    it('Given FormFlowProvider has the empty initial data', () => {
      scenario = mountComponent();
    });
    it('Expect to see required validation for name and age', () => {
      const validations = scenario.element.find('.ValidationLayout__message');
      expect(validations.length).toBe(2);
      expect(validations.at(0).text()).toBe('Name is required!');
      expect(validations.at(1).text()).toBe('Age is required!');
    });
  });
  describe('Advanced form rules', () => {
    const schemaData = {
      name: createValidations([], createRequiredValidation('Name is required.')),
      contacts: createValidations(
        [],
        createRequiredListValidation('One must have at least one contact.')
      ),
      'contacts[].type': createValidations(
        [],
        createRequiredValidation('Contact type is required.')
      ),
      'contacts[].value': createValidations(
        ['contacts[$0].type'],
        createRequiredValidation('Contact value is required.'),
        ({ data, get, path, value }) => {
          const index = path.match(/[(\d+)]/g)[0];
          const type = get(data, `contacts[${index}].type`);
          const validator =
            type === 'email'
              ? /[a-zA-Z]([a-zA-Z]|\d|[-_\.])*\@([a-zA-Z]|\d|[-_])+(\.([a-zA-Z]|\d|[-_])+)*/g
              : /\d+/g;
          const example = type === 'email' ? 'some@email.com' : '1234567890';
          const key = `${path}-invalid`;
          const isValid = !hasValue(value) || validator.test(value);
          const message = `The "${type}" is not valid. Expected something like "${example}".`;

          return { data, isValid, key, path, value, message };
        }
      ),
    };
    const initialData = {
      name: 'John',
      contacts: [
        { type: 'email', value: 'some@email.com' },
        { type: 'email', value: 'some-other@email.com' },
        { type: 'phone', value: '1234567890' },
      ],
    };

    function Contact({ index }) {
      const typeField = useFormFlowItem(`contacts[${index}].type`);
      const valueField = useFormFlowItem(`contacts[${index}].value`);
      const options = useRef(['email', 'phone']);
      const byPass = useCallback(item => item, []);

      return (
        <div className="Contact__item">
          <DropdownField
            {...typeField}
            options={options.current}
            formatText={byPass}
            formatValue={byPass}
            label="Type"
          />
          <InputField {...valueField} label="Contact" />
        </div>
      );
    }

    function CustomForm() {
      const nameField = useFormFlowItem('name');
      const { value: contacts = [] } = useFormFlowItem('contacts');

      return (
        <div>
          <InputField {...nameField} label="Name" />
          {contacts.map((_, index) => (
            <Contact key={`contact-${index}`} index={index} />
          ))}
        </div>
      );
    }

    describe('useFormFlowValidation', () => {
      describe('useFormFlowValidation would recompute validation after changing the related properties', () => {
        let scenario;
        it('Given FormFlowProvider has valid form data with conditional validation for contacts', () => {
          scenario = mountComponent({ schemaData, initialData, CustomChildren: CustomForm });
          expect(scenario.element.find('.ValidationLayout__message').length).toBe(0);
        });
        it('When the user changes the type of the last contact', () => {
          scenario.element
            .find('.Contact__item select')
            .at(2)
            .simulate('change', { target: { value: 'email' } });
        });
        it('Then the validation message should be displayed', () => {
          const validations = scenario.element.find('.ValidationLayout__message');
          expect(validations.length).toBe(1);
          expect(validations.at(0).text()).toBe(
            'The "email" is not valid. Expected something like "some@email.com".'
          );
        });
      });

      describe('useFormFlowValidation would recompute validation after changing a direct property', () => {
        let scenario;
        it('Given FormFlowProvider has valid form data', () => {
          scenario = mountComponent({ schemaData, initialData, CustomChildren: CustomForm });
          expect(scenario.element.find('.ValidationLayout__message').length).toBe(0);
        });
        it('When the user changes the name', () => {
          scenario.element
            .find('input[type="text"]')
            .at(0)
            .simulate('change', { target: { value: '' } });
        });
        it('Then the validation message should be displayed', () => {
          const validations = scenario.element.find('.ValidationLayout__message');
          expect(validations.length).toBe(1);
          expect(validations.at(0).text()).toBe('Name is required.');
        });
      });

      describe('useFormFlowValidation would not return validations for path out of the schemaData', () => {
        let scenario;

        function CustomFormExtraField() {
          const ageField = useFormFlowItem('age');

          return (
            <div>
              <CustomForm />
              <InputField {...ageField} label="Age" />
            </div>
          );
        }
        it('Given FormFlowProvider is ready with one extra field', () => {
          scenario = mountComponent({
            schemaData,
            initialData,
            CustomChildren: CustomFormExtraField,
          });
        });
        it('Expect to not have validations displayed', () => {
          const validations = scenario.element.find('.ValidationLayout__message');
          expect(validations.length).toBe(0);
        });
      });

      describe('useFormFlowValidation would return all validations when path is not provided', () => {
        let scenario;

        function CustomFormOnlyAllValidations() {
          const { validations } = useFormFlowValidation();

          return (
            <div>
              <Validation label="All Validations" validations={validations} />
            </div>
          );
        }
        it('Given FormFlowProvider is ready displaying all validations', () => {
          scenario = mountComponent({
            schemaData,
            initialData: {},
            CustomChildren: CustomFormOnlyAllValidations,
          });
        });
        it('Expect to display all primary validations', () => {
          const validations = scenario.element.find('.ValidationLayout__message');
          expect(validations.length).toBe(2);
          expect(validations.at(0).text()).toBe('Name is required.');
          expect(validations.at(1).text()).toBe('One must have at least one contact.');
        });
      });

      describe('useFormFlowValidation would collect all related validations when a json path for array without index is provided', () => {
        let scenario;

        function CustomFormOnlyContactsValidations() {
          const { validations } = useFormFlowValidation('contacts[].value');

          return (
            <div>
              <Validation label="All Validations" validations={validations} />
            </div>
          );
        }
        it('Given FormFlowProvider has partial invalid form data for contacts', () => {
          scenario = mountComponent({
            schemaData,
            initialData: {
              name: 'Jane',
              contacts: [{ type: 'email' }, { type: 'email' }, { type: 'phone' }],
            },
            CustomChildren: CustomFormOnlyContactsValidations,
          });
        });
        it('Expect to display all contacts validations', () => {
          const validations = scenario.element.find('.ValidationLayout__message');
          expect(validations.length).toBe(3);
          expect(validations.at(0).text()).toBe('Contact value is required.');
          expect(validations.at(1).text()).toBe('Contact value is required.');
          expect(validations.at(2).text()).toBe('Contact value is required.');
        });
      });

      describe('useFormFlowValidation would collect all related validations when a json path for array without index is provided', () => {
        let scenario;

        function CustomFormOnlyContactsValidations() {
          const { validations } = useFormFlowValidation('contacts[].value');

          return (
            <div>
              <Validation label="All Validations" validations={validations} />
            </div>
          );
        }
        it('Given FormFlowProvider has partial invalid form data for contacts', () => {
          scenario = mountComponent({
            schemaData,
            initialData: {
              name: 'Jane',
              contacts: [{ type: 'email' }, { type: 'email' }, { type: 'phone' }],
            },
            CustomChildren: CustomFormOnlyContactsValidations,
          });
        });
        it('Expect to display all contacts validations', () => {
          const validations = scenario.element.find('.ValidationLayout__message');
          expect(validations.length).toBe(3);
          expect(validations.at(0).text()).toBe('Contact value is required.');
          expect(validations.at(1).text()).toBe('Contact value is required.');
          expect(validations.at(2).text()).toBe('Contact value is required.');
        });
      });
    });

    describe('Using isAllValid', () => {
      describe('Form uses the isAllValid function to check if the whole form is valid', () => {
        let scenario;

        function CustomFormCheckIfValid() {
          const { isAllValid } = useFormFlowValidation();

          return (
            <div>
              <button type="button" disabled={!isAllValid()} />
            </div>
          );
        }
        it('Given FormFlowProvider has the whole form data valid', () => {
          scenario = mountComponent({
            schemaData,
            initialData,
            CustomChildren: CustomFormCheckIfValid,
          });
        });
        it('Expect to have the button enabled', () => {
          const button = scenario.element.find('button[type="button"]');
          expect(button.props().disabled).toBe(false);
        });
      });

      describe('Form uses the isAllValid function to check if the whole form is invalid', () => {
        let scenario;

        function CustomFormCheckIfValid() {
          const { isAllValid } = useFormFlowValidation();

          return (
            <div>
              <button type="button" disabled={!isAllValid()} />
            </div>
          );
        }
        it('Given FormFlowProvider has the invalid form data', () => {
          scenario = mountComponent({
            schemaData,
            initialData: {
              name: 'Jane',
              contacts: [{ type: 'email' }, { type: 'email' }, { type: 'phone' }],
            },
            CustomChildren: CustomFormCheckIfValid,
          });
        });
        it('Expect to have the button disabled', () => {
          const button = scenario.element.find('button[type="button"]');
          expect(button.props().disabled).toBe(true);
        });
      });

      describe('Form uses the isAllValid function to check if data is valid over array rules without index', () => {
        let scenario;

        function CustomFormCheckIfValid() {
          const { isAllValid } = useFormFlowValidation();

          return (
            <div>
              <button type="button" disabled={!isAllValid(['contacts[].value'])} />
            </div>
          );
        }
        it('Given FormFlowProvider has the valid form data for contacts', () => {
          scenario = mountComponent({
            schemaData,
            initialData,
            CustomChildren: CustomFormCheckIfValid,
          });
        });
        it('Expect to have the button enabled', () => {
          const button = scenario.element.find('button[type="button"]');
          expect(button.props().disabled).toBe(false);
        });
      });

      describe('Form uses the isAllValid function to check if data is invalid over array rules without index', () => {
        let scenario;

        function CustomFormCheckIfValid() {
          const { isAllValid } = useFormFlowValidation();

          return (
            <div>
              <button type="button" disabled={!isAllValid(['contacts[].value'])} />
            </div>
          );
        }
        it('Given FormFlowProvider has the invalid form data for contacts', () => {
          scenario = mountComponent({
            schemaData,
            initialData: {
              name: 'Jane',
              contacts: [{ type: 'email' }, { type: 'email' }, { type: 'phone' }],
            },
            CustomChildren: CustomFormCheckIfValid,
          });
        });
        it('Expect to have the button disabled', () => {
          const button = scenario.element.find('button[type="button"]');
          expect(button.props().disabled).toBe(true);
        });
      });
    });
  });
});
