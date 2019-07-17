import React from 'react';
import styled from 'styled-components';
import { useFormFlowItem } from '../src';
import RadioField from '../react-form-flow-examples/fields/Radiofield';

const RadioFieldRecipeLayout = styled.div``;

export default function RadioFieldRecipe() {
  const handField = useFormFlowItem('hand');

  return (
    <RadioFieldRecipeLayout>
      <h2>Interact with the checkboxes below by clicking...</h2>
      <fieldset>
        <legend>Left/Right hand</legend>
        <RadioField {...handField} label="Left" checkedValue="left" name="hand" />
        <RadioField {...handField} label="Right" checkedValue="right" name="hand" />
        <RadioField {...handField} label="Both" checkedValue="both" name="hand" />
        <span>
          value:
          {handField.value}
        </span>
      </fieldset>
    </RadioFieldRecipeLayout>
  );
}
