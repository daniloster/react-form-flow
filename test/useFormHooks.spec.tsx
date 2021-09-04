import { fireEvent, render } from '@testing-library/react';
import React, { useEffect } from 'react';
import FormFlowProvider, { useFormFlowItem } from '../src';
import useResetForm from '../src/useResetForm';
import useSubmitForm from '../src/useSubmitForm';
import InputField from '../tools/helpers/components/InputField';
import schemaData from '../tools/helpers/components/schemaDataPerson';

function defaultCapture() {}

describe('Form Hooks', () => {
  function PersonForm({ capture = defaultCapture, submit }) {
    const nameField = useFormFlowItem('name');
    const ageField = useFormFlowItem('age');
    const { onReset, ref } = useResetForm();
    const { onSubmit } = useSubmitForm(submit);
    useEffect(() => {
      capture(nameField.data);
    }, [capture, nameField.data]);

    return (
      <form onReset={onReset} onSubmit={onSubmit} ref={ref}>
        <InputField {...nameField} label="Name" />
        <InputField {...ageField} label="Age" />
        <button type="reset" onClick={onReset}>
          Reset
        </button>
        <button type="submit">Submit</button>
      </form>
    );
  }

  function mountComponent(customProps = {}) {
    const { capture, submit, CustomChildren, ...otherProps } = customProps;
    const props = {
      initialData: {
        name: '',
        age: '',
      },
      schemaData,
      ...otherProps,
    };
    const Children = CustomChildren || PersonForm;

    const wrapper = render(
      <FormFlowProvider children={<Children capture={capture} submit={submit} />} {...props} />
    );

    return {
      wrapper,
      props,
    };
  }
  test('if resets form', async () => {
    let data;
    const scenario = mountComponent({ capture: currentData => (data = currentData) });

    fireEvent.change(scenario.wrapper.container.querySelectorAll('input[type="text"]')[0], {
      target: { value: 'John Doe' },
    });

    const resetButton = await scenario.wrapper.getByText('Reset');
    expect(fireEvent.click(resetButton)).toBeTruthy();
  });

  test('if submits form', async () => {
    let data;
    function submit(values, { isValid }) {
      data = { values, isValid };
    }
    const scenario = mountComponent({ submit });

    fireEvent.change(scenario.wrapper.container.querySelectorAll('input[type="text"]')[0], {
      target: { value: 'John Doe' },
    });

    fireEvent.change(scenario.wrapper.container.querySelectorAll('input[type="text"]')[1], {
      target: { value: '30' },
    });

    const submitButton = await scenario.wrapper.getByText('Submit');
    expect(fireEvent.click(submitButton)).toBeTruthy();

    expect(data).toEqual({
      values: {
        name: 'John Doe',
        age: '30',
      },
      isValid: true,
    });
  });
});
