import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { FormFlowProvider, useFormFlowItem } from '../src';
import InputField from '../tools/helpers/components/InputField';
import schemaDataPerson from '../tools/helpers/components/schemaDataPerson';

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
  const props = {
    initialData: {
      name: '',
      age: '',
    },
    schemaData: schemaDataPerson,
    ...customProps,
  };

  let element;
  act(() => {
    element = mount(<FormFlowProvider children={<PersonForm />} {...props} />);
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
      const validations = scenario.element.find('.Validation__message');
      expect(validations.length).toBe(2);
      expect(validations.at(0).text()).toBe('Name is required!');
      expect(validations.at(1).text()).toBe('Age is required!');
    });
  });
});
