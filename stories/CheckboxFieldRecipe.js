import React from 'react';
import styled from 'styled-components';
import CheckboxField from '../react-form-flow-examples/fields/CheckboxField';
import { useFormFlowField } from '../src';

const CheckboxFieldRecipeLayout = styled.div``;

export default function CheckboxFieldRecipe() {
  const skillsField = useFormFlowField('skills', { eventType: 'value' });

  return (
    <CheckboxFieldRecipeLayout>
      <h2>Interact with the checkboxes below by clicking...</h2>
      <fieldset>
        <legend>Skills</legend>
        <CheckboxField {...skillsField} label="Reading" checkedValue="reading" />
        <CheckboxField {...skillsField} label="Strategic View" checkedValue="strategic_view" />
        <CheckboxField {...skillsField} label="Cooking" checkedValue="cooking" />
        <CheckboxField {...skillsField} label="Playing football" checkedValue="football" />
        <span>
          value:
          {JSON.stringify(skillsField.value)}
        </span>
      </fieldset>
    </CheckboxFieldRecipeLayout>
  );
}
