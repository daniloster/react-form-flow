import React from 'react';
import styled from 'styled-components';
import { useFormFlowItem } from '../src';
import CheckboxField from '../tools/helpers/components/CheckboxField';

const CheckboxFieldRecipeLayout = styled.div``;

export default function CheckboxFieldRecipe() {
  const skillsField = useFormFlowItem('skills');

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
