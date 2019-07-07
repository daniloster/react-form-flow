import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, number } from '@storybook/addon-knobs';
import withLayout from './withLayout';
import getingStated from '../docs/markdown/GETTING_STARTED.md';
import recipesValidations from '../docs/markdown/RECIPES_VALIDATIONS.md';
import dropdownField from '../docs/markdown/RECIPES_DROPDOWN.md';
import inputField from '../docs/markdown/RECIPES_INPUT.md';

import AppInteractive from './AppInteractive';
import RecipesValidationsInteractive from './RecipesValidationsInteractive';
import FormFields from './FormFields';
import InputFieldRecipe from './InputFieldRecipe';
import DropdownFieldRecipe from './DropdownFieldRecipe';

storiesOf('Form', module)
  .addDecorator(withKnobs)
  .addDecorator(withLayout)
  .add(
    'Basic Form Flow',
    () => {
      const requiredNameMessage = text('Enter required message for name', 'Name is required!');
      const minNameLength = number('Enter the min lenth for name', 5);
      const requiredDescriptionMessage = text(
        'Enter required message for description',
        'Description is required!'
      );
      const minDescriptionLength = number('Enter the min lenth for description', 300);

      return (
        <AppInteractive
          minDescriptionLength={minDescriptionLength}
          minNameLength={minNameLength}
          requiredDescriptionMessage={requiredDescriptionMessage}
          requiredNameMessage={requiredNameMessage}
        />
      );
    },
    {
      notes: { markdown: getingStated },
    }
  );

storiesOf('Recipes', module)
  .addDecorator(withKnobs)
  .addDecorator(withLayout)
  .add(
    'Factoring validations',
    () => {
      const data = text(
        'Data',
        `{
  "name": "",
  "description": "",
  "passport": {
    "visa": {
      "value": 3,
      "unit": "days"
    }
  }
}`
      );
      const schemaData = text(
        'Schema',
        `{
  name: createValidations(
    [],
    createRequiredValidation('Name is required.')
  ),
  description: createValidations(
    [],
    createRequiredValidation('Description is required.')
  )
}`
      );
      const factories = text(
        'Factories',
        `/* Put your factory functions here in order to use in the schemaData */

/* Example */
function createRequiredValidation(message) {
  return ({ data, value, path }) => {
    const key = \`\${path}-required\`;
    const isValid = hasValue(value);

    return { data, value, path, key, isValid, message };
  };
}
/* End: Example */
`
      );

      return (
        <RecipesValidationsInteractive data={data} factories={factories} schemaData={schemaData} />
      );
    },
    {
      notes: { markdown: recipesValidations },
    }
  )
  .add(
    'Dropdown Field Recipe',
    () => (
      <FormFields>
        <DropdownFieldRecipe />
      </FormFields>
    ),
    {
      notes: { markdown: dropdownField },
    }
  )
  .add(
    'Input Field Recipe',
    () => (
      <FormFields>
        <InputFieldRecipe />
      </FormFields>
    ),
    {
      notes: { markdown: inputField },
    }
  );
