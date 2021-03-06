# Input Field Recipe

The idea here is to show how to optimise your performance by reusing a input field.

[Old Documentation for Input Field Recipe](https://github.com/daniloster/react-form-flow/blob/master/markdown/baseUsage/RECIPES_INPUT.md)

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

export default function Validation({ errors = [] }) {
  return (
    <ValidationLayout>
      {validations.map(
        ({ key, message }) =>(
          <div className="ValidationLayout__message" key={key}>
            {message}
          </div>
        )
      )}
    </ValidationLayout>
  );
}
```

### InputField

In the case below, validations are received always and the consumer decides when to display them.

**Note**: For this case, we are only displaying after visiting the field, but, nothing block you to pass another property `showValidation` when the form is submitted, then, it would be able to display by `{(isVisited || showValidation) && <Validation validations={validations} />}`.

```jsx
import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import styled from 'styled-components';
import Validation from './Validation';

const InputFieldLayout = styled.div`
  padding: 0 0 10px 0;
  label > span {
    display: block;
  }
  .InputFieldLayout__validations {
    display: block;
  }
`;

export default function InputField(props) {
  const {
    errors,
    field,
    label: labelText,
    submitted,
    touched,
  } = props
  const id = useRef(uuid.v4());

  return (
    <InputFieldLayout>
      <label htmlFor={id.current}>
        <span>{labelText}</span>
        <input id={id.current} type="text" {...field} />
      </label>
      <div className="InputFieldLayout__validations">
        {(submitted || touched) && <Validation errors={errors} />}
      </div>
    </InputFieldLayout>
  );
}

InputField.defaultProps = {
  label: null,
  errors: [],
  value: '',
};
```

## Using the InputField

```jsx
import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { useFormFlowField } from 'react-form-flow';
import Validation from '../tools/helpers/components/Validation';

const InputFieldRecipeLayout = styled.div``;

export default function InputFieldRecipe() {
  const nameField = useFormFlowField('name');

  return (
    <InputFieldRecipeLayout>
      <h2>Interact with the input field by focusing and leaving the field...</h2>

      <InputField {...nameField} label="Name" />
      <div>{nameField.value}</div>
    </InputFieldRecipeLayout>
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
    <InputFieldRecipe />
  </FormFlowProvider>
```
