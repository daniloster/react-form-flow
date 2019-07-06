import React from 'react';
import styled from 'styled-components';
import { useFormFlowItem } from '../src';
import InputField from '../tools/helpers/components/InputField';
import CheckboxField from '../tools/helpers/components/CheckboxField';
import RadioField from '../tools/helpers/components/Radiofield';
import DropdownField from '../tools/helpers/components/DropdownField';

const RecipesFieldsLayout = styled.div``;

const countries = [
  { id: 'br', name: 'Brazil' },
  { id: 'ie', name: 'Ireland' },
  { id: 'it', name: 'Italy' },
  { id: 'sp', name: 'Spain' },
  { id: 'uk', name: 'United Kingdom' },
  { id: 'fr', name: 'France' },
  { id: 'us', name: 'United States' },
];
const empty = { id: '', name: 'Select your country' };

function formatValue({ id }) {
  return id;
}

function formatText({ name }) {
  return name;
}

export default function RecipesFields() {
  const nameField = useFormFlowItem('name');
  const nationalityField = useFormFlowItem('nationality');
  const skillsField = useFormFlowItem('skills');
  const handField = useFormFlowItem('hand');

  return (
    <RecipesFieldsLayout>
      <h2>Interact with the form...</h2>

      <InputField {...nameField} label="Name" />
      <DropdownField
        {...nationalityField}
        empty={empty}
        label="Nationality"
        options={countries}
        formatValue={formatValue}
        formatText={formatText}
      />
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
    </RecipesFieldsLayout>
  );
}
