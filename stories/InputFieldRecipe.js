import React from 'react';
import styled from 'styled-components';
import InputField from '../react-form-flow-examples/fields/InputField';
import { useFormFlowField } from '../src';

const InputFieldRecipeLayout = styled.div``;

export default function InputFieldRecipe() {
  const nameField = useFormFlowField('name');

  return (
    <InputFieldRecipeLayout>
      <h2>Interact with the input field by focusing and leaving the field...</h2>

      <InputField {...nameField} label="Name" />
      <div>{nameField.value}</div>
    </InputFieldRecipeLayout>
  );
}
