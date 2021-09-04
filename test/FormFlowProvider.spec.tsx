import { fireEvent, render, screen, waitForElement } from '@testing-library/react';
import React, { useCallback, useRef } from 'react';
import {
  createValidations,
  FormFlowProvider,
  useFormFlowItem,
  useFormFlowValidation
} from '../src';
import useFormFlowField from '../src/useFormFlowField';
import createRequiredListValidation from '../tools/helpers/components/createRequiredListValidation';
import createRequiredValidation from '../tools/helpers/components/createRequiredValidation';
import DropdownField from '../tools/helpers/components/DropdownField';
import hasValue from '../tools/helpers/components/hasValue';
import InputField from '../tools/helpers/components/InputField';
import schemaDataPerson from '../tools/helpers/components/schemaDataPerson';
import Validation from '../tools/helpers/components/Validation';

function PersonForm() {
  const name = useFormFlowField('name');
  const age = useFormFlowField('age');
  const { value, data } = useFormFlowItem();

  return (
    <div>
      <InputField {...name.field} validations={name.errors} label="Name" />
      <InputField {...age.field} validations={age.errors} label="Age" />
      <span data-testid="is-same">{value === data ? 'same' : 'different'}</span>
    </div>
  );
}

type MountComponentProps = {
  CustomChildren?: React.ElementType;
  initialData?: any;
  schemaData?: any;
}

function mountComponent(customProps: MountComponentProps = {}) {
  const { CustomChildren, ...otherProps } = customProps;
  const props = {
    initialData: {
      name: '',
      age: '',
    },
    schemaData: schemaDataPerson,
    ...otherProps,
  };
  const Children = CustomChildren || PersonForm;

  const wrapper = render(
    <FormFlowProvider {...props}>
      <Children />
    </FormFlowProvider>
  );

  return {
    wrapper,
    props,
  };
}

describe('<FormFlowProvider />', () => {
  test('FormFlowProvider give access to data and value of a json path by using useFormFlowItem', async () => {
    const scenario = mountComponent();
    const validations = await screen.getAllByRole('validation');
    expect(validations.length).toBe(2); // useFormFlowField filters validations only returning errors
    expect(validations[0].textContent).toBe('Name is required!');
    expect(validations[1].textContent).toBe('Age is required!');
  });

  const schemaData = {
    name: createValidations([], createRequiredValidation('Name is required.')),
    contacts: createValidations(
      [],
      createRequiredListValidation('One must have at least one contact.')
    ),
    'contacts[].type': createValidations([], createRequiredValidation('Contact type is required.')),
    'contacts[].value': createValidations(
      ['contacts[$0].type'],
      createRequiredValidation('Contact value is required.'),
      ({ data, get, path, value, ...others }) => {
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

        return { ...others, data, isValid, key, path, value, message };
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
    const type = useFormFlowField(`contacts[${index}].type`, { eventType: 'value' });
    const value = useFormFlowField(`contacts[${index}].value`);
    const options = useRef(['email', 'phone']);
    const byPass = useCallback(item => item, []);

    return (
      <div className="Contact__item">
        <DropdownField
          {...type.field}
          dirty={type.dirty}
          touched={type.touched}
          validations={type.errors}
          options={options.current}
          formatText={byPass}
          formatValue={byPass}
          label="Type"
        />
        <InputField {...value.field} validations={value.errors} label="Contact" />
      </div>
    );
  }

  function CustomForm() {
    const name = useFormFlowField('name');
    const { value: contacts = [] } = useFormFlowItem('contacts');

    return (
      <div>
        <InputField {...name.field} validations={name.errors} label="Name" />
        {contacts.map((_, index) => (
          <Contact key={`contact-${index}`} index={index} />
        ))}
      </div>
    );
  }

  describe('Advanced form rules', () => {
    test('useFormFlowValidation would recompute validation after changing the related properties', async () => {
      const scenario = mountComponent({ schemaData, initialData, CustomChildren: CustomForm });
      fireEvent.change(scenario.wrapper.container.querySelectorAll('.Contact__item select')[2], {
        target: { value: 'email' },
      });
      const validations = await waitForElement(() => screen.getAllByRole('validation'));
      expect(validations).toHaveLength(1);
      expect(validations[0].textContent).toBe(
        'The "email" is not valid. Expected something like "some@email.com".'
      );
    });

    test('useFormFlowValidation would recompute validation after changing a direct property', async () => {
      const scenario = mountComponent({ schemaData, initialData, CustomChildren: CustomForm });
      try {
        await screen.getAllByRole('validation');
        expect(true).toBeFalsy();
      } catch {
        expect(true).toBeTruthy();
      }
      fireEvent.change(scenario.wrapper.container.querySelectorAll('input[type="text"]')[0], {
        target: { value: '' },
      });
      const validations = await screen.getAllByRole('validation');
      expect(validations.length).toBe(1);
      expect(validations[0].textContent).toBe('Name is required.');
    });

    test('useFormFlowValidation would not return validations for path out of the schemaData', async () => {
      function CustomFormExtraField() {
        const age = useFormFlowField('age');

        return (
          <div>
            <CustomForm />
            <InputField {...age.field} validations={age.errors} label="Age" />
          </div>
        );
      }
      const scenario = mountComponent({
        schemaData,
        initialData,
        CustomChildren: CustomFormExtraField,
      });
      try {
        await screen.getAllByRole('validation');
        expect(true).toBeFalsy();
      } catch {
        expect(true).toBeTruthy();
      }
    });

    test('useFormFlowValidation would not return validations for path out of the schemaData', async () => {
      function CustomFormExtraField() {
        const age = useFormFlowField('age');

        return (
          <div>
            <CustomForm />
            <InputField {...age.field} validations={age.errors} label="Age" />
          </div>
        );
      }
      const scenario = mountComponent({
        schemaData,
        initialData,
        CustomChildren: CustomFormExtraField,
      });
      try {
        await screen.getAllByRole('validation');
        expect(true).toBeFalsy();
      } catch {
        expect(true).toBeTruthy();
      }
    });

    test('useFormFlowValidation would not return validations for path out of the schemaData', async () => {
      let scenario;

      function CustomFormExtraField() {
        const age = useFormFlowField('age');

        return (
          <div>
            <CustomForm />
            <InputField {...age.field} validations={age.errors} label="Age" />
          </div>
        );
      }
      scenario = mountComponent({
        schemaData,
        initialData,
        CustomChildren: CustomFormExtraField,
      });
      try {
        await screen.getAllByRole('validation');
        expect(true).toBeFalsy();
      } catch {
        expect(true).toBeTruthy();
      }
    });

    test('useFormFlowValidation would return all validations when path is not provided', async () => {
      function CustomFormOnlyAllValidations() {
        const { validations } = useFormFlowValidation();

        return (
          <div>
            <Validation label="All Validations" validations={validations} />
          </div>
        );
      }
      const scenario = mountComponent({
        schemaData,
        initialData: {},
        CustomChildren: CustomFormOnlyAllValidations,
      });

      const validations = await screen.getAllByRole('validation');
      expect(validations).toHaveLength(2);
      expect(validations[0].textContent).toBe('Name is required.');
      expect(validations[1].textContent).toBe('One must have at least one contact.');
    });

    test('useFormFlowValidation would collect all related validations when a json path for array without index is provided', async () => {
      function CustomFormOnlyContactsValidations() {
        const { validations } = useFormFlowValidation('contacts[].value');

        return (
          <div>
            <Validation label="All Validations" validations={validations} />
          </div>
        );
      }

      const scenario = mountComponent({
        schemaData,
        initialData: {
          name: 'Jane',
          contacts: [{ type: 'email' }, { type: 'email' }, { type: 'phone' }],
        },
        CustomChildren: CustomFormOnlyContactsValidations,
      });
      const validations = await screen.getAllByRole('validation');
      expect(validations).toHaveLength(3);
      expect(validations[0].textContent).toBe('Contact value is required.');
      expect(validations[1].textContent).toBe('Contact value is required.');
      expect(validations[2].textContent).toBe('Contact value is required.');
    });

    test('useFormFlowValidation would collect all related validations when a json path for array without index is provided', async () => {
      function CustomFormOnlyContactsValidations() {
        const { validations } = useFormFlowValidation('contacts[].value');

        return (
          <div>
            <Validation label="All Validations" validations={validations} />
          </div>
        );
      }

      const scenario = mountComponent({
        schemaData,
        initialData: {
          name: 'Jane',
          contacts: [{ type: 'email' }, { type: 'email' }, { type: 'phone' }],
        },
        CustomChildren: CustomFormOnlyContactsValidations,
      });
      const validations = await screen.getAllByRole('validation');
      expect(validations).toHaveLength(3);
      expect(validations[0].textContent).toBe('Contact value is required.');
      expect(validations[1].textContent).toBe('Contact value is required.');
      expect(validations[2].textContent).toBe('Contact value is required.');
    });

    test('useFormFlowValidation would not return validations for path out of the schemaData', async () => {
      function CustomFormExtraField() {
        const age = useFormFlowField('age');

        return (
          <div>
            <CustomForm />
            <InputField {...age.field} validations={age.errors} label="Age" />
          </div>
        );
      }
      const scenario = mountComponent({
        schemaData,
        initialData,
        CustomChildren: CustomFormExtraField,
      });
      try {
        await screen.getAllByRole('validation');
        expect(true).toBeFalsy();
      } catch {
        expect(true).toBeTruthy();
      }
    });
  });

  describe('Using touched', () => {
    test('if Form will display the error only when touched', async () => {
      function CustomFormExtraField() {
        const name = useFormFlowField('name');

        return (
          <div>
            <InputField
              {...name.field}
              touched={name.touched}
              validations={name.errors}
              label="Name"
            />
          </div>
        );
      }
      const scenario = mountComponent({
        schemaData,
        initialData: {
          name: '',
        },
        CustomChildren: CustomFormExtraField,
      });
      try {
        await screen.getAllByRole('validation');
        expect(true).toBeFalsy();
      } catch {
        expect(true).toBeTruthy();
      }
      // Blur on name
      fireEvent.blur(scenario.wrapper.container.querySelector('input'));
      // Erros for name
      const errors = await waitForElement(() => screen.getAllByRole('validation'));
      expect(errors).toHaveLength(1);
    });
  });

  describe('Using isAllValid', () => {
    test('Form uses the isAllValid function to check if the whole form is valid', async () => {
      function CustomFormCheckIfValid() {
        const { isAllValid } = useFormFlowValidation();

        return (
          <div>
            <button role="button" type="button" disabled={!isAllValid()} />
          </div>
        );
      }
      const scenario = mountComponent({
        schemaData,
        initialData,
        CustomChildren: CustomFormCheckIfValid,
      });
      const button = await screen.getByRole('button');
      expect(button.disabled).toBe(false);
    });

    test('Form uses the isAllValid function to check if the whole form is invalid', async () => {
      function CustomFormCheckIfValid() {
        const { isAllValid } = useFormFlowValidation();

        return (
          <div>
            <button role="button" type="button" disabled={!isAllValid()} />
          </div>
        );
      }
      const scenario = mountComponent({
        schemaData,
        initialData: {
          name: 'Jane',
          contacts: [{ type: 'email' }, { type: 'email' }, { type: 'phone' }],
        },
        CustomChildren: CustomFormCheckIfValid,
      });
      const button = await screen.getByRole('button');
      expect(button).toHaveAttribute("disabled");
    });

    test('Form uses the isAllValid function to check if data is valid over array rules without index', async () => {
      function CustomFormCheckIfValid() {
        const { isAllValid } = useFormFlowValidation();

        return (
          <div>
            <button role="button" type="button" disabled={!isAllValid(['contacts[].value'])} />
          </div>
        );
      }
      const scenario = mountComponent({
        schemaData,
        initialData,
        CustomChildren: CustomFormCheckIfValid,
      });
      const button = await screen.getByRole('button');
      expect(button).not.toHaveAttribute("disabled");
    });

    test('Form uses the isAllValid function to check if data is invalid over array rules without index', async () => {
      function CustomFormCheckIfValid() {
        const { isAllValid } = useFormFlowValidation();

        return (
          <div>
            <button role="button" type="button" disabled={!isAllValid(['contacts[].value'])} />
          </div>
        );
      }
      const scenario = mountComponent({
        schemaData,
        initialData: {
          name: 'Jane',
          contacts: [{ type: 'email' }, { type: 'email' }, { type: 'phone' }],
        },
        CustomChildren: CustomFormCheckIfValid,
      });
      const button = await screen.getByRole('button');
      expect(button.disabled).toBe(true);
    });

    test('Form returns value as data for useFormflowItem without path', async () => {
      const scenario = mountComponent({
        schemaData,
        initialData: {
          name: 'Jane',
          contacts: [{ type: 'email' }, { type: 'email' }, { type: 'phone' }],
        },
      });
      const isSame = await waitForElement(() => screen.getByTestId('is-same'));
      expect(isSame.textContent).toEqual('same');
    });
  });
});
