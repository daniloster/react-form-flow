import React, { useCallback, useRef } from 'react';
import FormFlowProvider, { createValidations, useFormFlowItem } from '../src';
import createRequiredListValidation from '../tools/helpers/components/createRequiredListValidation';
import createRequiredValidation from '../tools/helpers/components/createRequiredValidation';
import DropdownField from '../tools/helpers/components/DropdownField';
import hasValue from '../tools/helpers/components/hasValue';
import InputField from '../tools/helpers/components/InputField';

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

export default function AppRelatedPathInvalidation() {
  return (
    <FormFlowProvider schemaData={schemaData} initialData={initialData}>
      <CustomForm />
    </FormFlowProvider>
  );
}
