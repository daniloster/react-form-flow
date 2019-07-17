import React from 'react';
import styled from 'styled-components';
import { useFormFlowItem } from '../src';
import DropdownField from '../react-form-flow-examples/fields/DropdownField';

const DropdownFieldRecipeLayout = styled.div``;

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

function formatValue(item) {
  const { id } = item || {};

  return id;
}

function formatText(item) {
  const { name } = item || {};

  return name;
}

export default function DropdownFieldRecipe() {
  const nationalityField = useFormFlowItem('nationality');

  return (
    <DropdownFieldRecipeLayout>
      <h2>Interact with dropdown below by selecting a value...</h2>

      <DropdownField
        {...nationalityField}
        empty={empty}
        label="Nationality"
        options={countries}
        formatValue={formatValue}
        formatText={formatText}
      />
      <div>
        {!nationalityField.value && <strong>No value selected yet.</strong>}
        {nationalityField.value && (
          <div>
            <strong>Value:</strong>
            <span>{JSON.stringify(nationalityField.value)}</span>
          </div>
        )}
      </div>
    </DropdownFieldRecipeLayout>
  );
}
