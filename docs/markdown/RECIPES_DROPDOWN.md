# Dropdown Field Recipe

This recipe will show how to build a simple dropdown using the select markup following the interface defined by `react-form-flow`.

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

**Note**: For this case, we are only displaying after visiting the field, but, nothing block you to pass another property `showValidation` when the form is submitted, then, it would be able to display by `{(isVisited || showValidation) && <Validation validations={validations} />}`.

```jsx
import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import styled from 'styled-components';
import Validation from './Validation';

const DropdownFieldLayout = styled.div`
  padding: 0 0 10px 0;
  display: grid;
  grid-template-columns: min-content;
  grid-template-rows: min-content auto;

  label {
    display: grid;
    grid-template-columns: min-content;
    grid-template-rows: min-content min-content min-content;
    white-space: nowrap;
    grid-gap: 10px;
  }

  .DropdownFieldLayout__validations {
    display: block;
    white-space: nowrap;
  }
`;

export default function DropdownField({
  empty,
  formatText,
  formatValue,
  label: labelText,
  onChangeValue,
  options,
  validations,
  value,
}) {
  const id = useRef(uuid.v4());
  const [isVisited, setIsVisited] = useState(false);
  const onChange = useCallback(
    e => {
      const { value: optionValue } = e.target;

      onChangeValue(options.find(option => formatValue(option) === optionValue) || null);
      if (!isVisited) {
        setIsVisited(true);
      }
    },
    [formatValue, onChangeValue, options]
  );

  return (
    <DropdownFieldLayout>
      <label htmlFor={id.current}>
        <span>{labelText}</span>
        <select onChange={onChange} value={formatValue(value)}>
          {empty && <option value={formatValue(empty)}>{formatText(empty)}</option>}
          {Boolean(options && options.length) &&
            options.map(option => {
              const text = formatText(option);
              const optionValue = formatValue(option);

              return <option value={optionValue}>{text}</option>;
            })}
        </select>
      </label>
      <div className="DropdownFieldLayout__validations">
        {isVisited && <Validation validations={validations} />}
      </div>
    </DropdownFieldLayout>
  );
}

DropdownField.propTypes = {
  empty: PropTypes.oneOf([PropTypes.any]),
  formatText: PropTypes.func.isRequired,
  formatValue: PropTypes.func.isRequired,
  label: PropTypes.string,
  onChangeValue: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  validations: PropTypes.arrayOf(PropTypes.shape({})),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
};

DropdownField.defaultProps = {
  empty: null,
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
import DropdownField from './DropdownField';

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
```

And then...

```jsx
  import { FormFlowProvider } from 'react-form-flow';

  const initialData = { ... };
  const schemaData = { ... };

  // ...

  <FormFlowProvider initialData={initialData} schemaData={schemaData}>
    <DropdownFieldRecipe />
  </FormFlowProvider>
```
