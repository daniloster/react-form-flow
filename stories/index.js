import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, number } from '@storybook/addon-knobs';
import withLayout from './withLayout';
import readme from '../README.md';
import recipesValidations from '../docs/markdown/RECIPES_VALIDATIONS.md';
import recipesFields from '../docs/markdown/RECIPES_FIELDS.md';

import AppInteractive from './AppInteractive';

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
      notes: { markdown: readme },
    }
  );

storiesOf('Recipes', module)
  .addDecorator(withKnobs)
  .addDecorator(withLayout)
  .add(
    'Factoring validations',
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
