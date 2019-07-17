import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { useFormFlowItem } from '../src';
import InputField from '../react-form-flow-examples/fields/InputField';

const InputFieldRecipeLayout = styled.div``;

export default function InputFieldRecipe() {
  const nameField = useFormFlowItem('name');

  return (
    <InputFieldRecipeLayout>
      <h2>Interact with the input field by focusing and leaving the field...</h2>

      <InputField {...nameField} label="Name" />
      <div>{nameField.value}</div>
    </InputFieldRecipeLayout>
  );
}
