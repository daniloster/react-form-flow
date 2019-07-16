# Radio Field Recipe

This recipe will show how to build a group/simple radio using the `input[type="radio"]` markup following the interface defined by `react-form-flow`.

## Code

Here, we are using [styled-components](https://www.styled-components.com/) for prettifying styles.

### RadioField

Here, validations are received always and the consumer decides when to display them.

**Note**: For this case, there is no validation added. But, as all the other recipes, we cloud display the validations straightaway or through some property to control if it will be displayed. e.g. `showValidation` when the form is submitted, then, it would be able to display by `{showValidation && <Validation validations={validations} />}`.

```jsx
import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import styled from 'styled-components';

const RadioFieldLayout = styled.div`
  padding: 0 0 10px 0;
  display: grid;
  grid-template-columns: min-content;
  grid-template-rows: min-content auto;

  label {
    display: grid;
    grid-template-columns: min-content min-content;
    grid-template-rows: auto;
    white-space: nowrap;
    grid-gap: 10px;
  }

  .RadioFieldLayout__validations {
    display: block;
    white-space: nowrap;
  }
`;

export default function RadioField({
  checkedValue,
  name,
  label: labelText,
  onChangeValue,
  validations,
  value,
}) {
  const id = useRef(uuid.v4());
  const onChange = useCallback(() => {
    onChangeValue(checkedValue);
  }, [checkedValue, onChangeValue]);

  return (
    <RadioFieldLayout>
      <label htmlFor={id.current}>
        <span>{labelText}</span>
        <input
          id={id.current}
          name={name}
          type="radio"
          onChange={onChange}
          checked={value === checkedValue}
        />
      </label>
    </RadioFieldLayout>
  );
}

RadioField.propTypes = {
  checkedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
    .isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  onChangeValue: PropTypes.func.isRequired,
  validations: PropTypes.arrayOf(PropTypes.shape({})),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
};

RadioField.defaultProps = {
  label: null,
  validations: [],
  value: '',
};
```

## Using the RadioField

After building the Dropdown, see below how to use it.

```jsx
import React from 'react';
import styled from 'styled-components';
import { useFormFlowItem } from 'react-form-flow';
import RadioField from './RadioField';

const RadioFieldRecipeLayout = styled.div``;

export default function RadioFieldRecipe() {
  const skillsField = useFormFlowItem('skills');

  return (
    <RadioFieldRecipeLayout>
      <h2>Interact with the radios below by clicking...</h2>
      <p>
        <strong>Note:</strong>
        <span>
          the property <strong>name</strong> is important for a radio in a form.
        </span>
      </p>
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
```

And then...

```jsx
  import { FormFlowProvider } from 'react-form-flow';

  const initialData = { ... };
  const schemaData = { ... };

  // ...

  <FormFlowProvider initialData={initialData} schemaData={schemaData}>
    <RadioFieldRecipe />
  </FormFlowProvider>
```
