import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, number } from '@storybook/addon-knobs';
import withLayout from './withLayout';
import getingStated from '../docs/markdown/GETTING_STARTED.md';
import recipesValidations from '../docs/markdown/RECIPES_VALIDATIONS.md';
import recipesFields from '../docs/markdown/RECIPES_FIELDS.md';

import AppInteractive from './AppInteractive';
import RecipesValidationsInteractive from './RecipesValidationsInteractive';

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
        name: '',
        description: '',
        passaport: {
          visa: {
            value: 3,
            unit: 'days'
          }
        }
      }`
      );
      const schemaData = text(
        'Schema',
        `{
        name: createValidations(
          [],
          ({ data, value, path }) => {
            const key = \`\${path}-required\`;
            const isValid = hasValue(value);

            return { data, value, path, key, isValid, message };
          }
        ),
        description: createValidations(
          [],
          ({ data, value, path }) => {
            const key = \`\${path}-required\`;
            const isValid = hasValue(value);

            return { data, value, path, key, isValid, message };
          }
        )
      }`
      );

      return <RecipesValidationsInteractive data={data} schemaData={schemaData} />;
    },
    {
      notes: { markdown: recipesValidations },
    }
  )
  .add(
    'Custom field',
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
      notes: { markdown: recipesFields },
    }
  );
