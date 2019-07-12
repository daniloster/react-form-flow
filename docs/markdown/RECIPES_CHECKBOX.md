# Checkbox Field Recipe

This recipe will show how to build a group/simple checkbox using the `input[type="checkbox"]` markup following the interface defined by `react-form-flow`.

## Code

Here, we are using [styled-components](https://www.styled-components.com/) for prettifying styles.

### Validation

You will probably need a component to display the validations, see the draft below.

```jsx
import React from 'react';
import styled from 'styled-components';

const ValidationLayout = styled.section`
  .ValidationLayout__message {
    color: red;
  }
`;

export default function Validation({ validations = [] }) {
  return (
    <ValidationLayout>
      {validations.map(
        ({ key, isValid, message }) =>
          !isValid && (
            <div className="ValidationLayout__message" key={key}>
              {message}
            </div>
          )
      )}
    </ValidationLayout>
  );
}
```

### DropdownField

Here, validations are received always and the consumer decides when to display them.

**Note**: For this case, we are displaying the validations straightaway, but, nothing block you to pass some property to control as it will be displayed. e.g. `showValidation` when the form is submitted, then, it would be able to display by `{showValidation && <Validation validations={validations} />}`.

```jsx
import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import styled from 'styled-components';
import Validation from './Validation';

const CheckboxFieldLayout = styled.div`
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

  .CheckboxFieldLayout__validations {
    display: block;
    white-space: nowrap;
  }
`;

export default function CheckboxField({
  checkedValue,
  label: labelText,
  onChangeValue,
  validations,
  value,
}) {
  const id = useRef(uuid.v4());
  const onChange = useCallback(() => {
    const treatedValue = value || [];
    const hasValue = treatedValue.includes(checkedValue);
    const newValue = hasValue
      ? treatedValue.filter(val => val !== checkedValue)
      : treatedValue.concat(checkedValue);

    onChangeValue(newValue);
  }, [checkedValue, onChangeValue, value]);

  return (
    <CheckboxFieldLayout>
      <label htmlFor={id.current}>
        <span>{labelText}</span>
        <input
          id={id.current}
          type="checkbox"
          onChange={onChange}
          checked={(value || []).includes(checkedValue)}
        />
      </label>
      <div className="CheckboxFieldLayout__validations">
        <Validation validations={validations} />
      </div>
    </CheckboxFieldLayout>
  );
}

CheckboxField.propTypes = {
  checkedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
    .isRequired,
  label: PropTypes.string,
  onChangeValue: PropTypes.func.isRequired,
  validations: PropTypes.arrayOf(PropTypes.shape({})),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.any),
  ]),
};

CheckboxField.defaultProps = {
  label: null,
  validations: [],
  value: '',
};
```

## Using the DropdownField

After building the Dropdown, see below how to use it.

```jsx
import React from 'react';
import styled from 'styled-components';
import { useFormFlowItem } from 'react-form-flow';
import CheckboxField from './CheckboxField';

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
```

And then...

```jsx
  import { FormFlowProvider } from 'react-form-flow';

  const initialData = { ... };
  const schemaData = { ... };

  // ...

  <FormFlowProvider initialData={initialData} schemaData={schemaData}>
    <CheckboxFieldRecipe />
  </FormFlowProvider>
```
