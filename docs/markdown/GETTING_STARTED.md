### How to use it

Define your form data wrapping with the container below.

```html
import FormFlowProvider from 'react-form-flow';
```

Use hooks to get values, event handler and validations.

```html
import { useFormFlowItem, useFormFlowValidation } from 'react-form-flow';
```

## Getting started

`react-form-flow` as its name describes is a library to define a common and automated workflow to collect and validate form data. Allow user to consume the data and validation based on the json path.

To improve your productivity, it would be good to create your core form components such as input, dropdowns and on and on following the `react-form-flow` spec.

_JSON PATH_ is a notation to navigate through the JSON object.

e.g.

```js
const data = {
    person: {
      id: 1,
      name: 'Jane Doe',
      email: 'jane@doe.dead'
      children:[
        {id: 2, name: 'John Doe'}
      ]
    }
};
```

So, observing the json above, the json path to access the name of first child is `"person.chidlren[0].name"`.

### Validation

```jsx
import React from 'react';

export default function Validation({ label, validations }) {
  return (
    <section>
      {!!label && <div>{label}</div>}
      {validations.map(({ key, isValid, message }) => !isValid && <div key={key}>{message}</div>)}
    </section>
  );
}
```

### InputField

The input field could receive from the `useFormFlowItem` an object with the spec below.

```js
{
  onChangeValue /* Function to update an object regarding the json path and value */,
  onChange /* Function to handle input event "change" */,
  setData /* Function to set the whole form data */,
  validations  /* arrayOf(Validation) */,
  value /* string */,
}
```

Component...

```jsx
import React from 'react';
import Validation from './Validation';

/**
 * @typedef Validation
 * @property {object} data
 * @property {any} value
 * @property {string} path
 * @property {string} key
 * @property {boolean} isValid
 * @property {string|React.node} message
 * */

export default function InputField({
  label,
  onChange,
  validations /* {array<Validation>} */,
  value,
}) {
  return (
    <div>
      <div>{label}</div>
      <input type="text" onChange={onChange} value={value} />
      <div>
        <Validation validations={validations} />
      </div>
    </div>
  );
}

InputField.defaultProps = {
  value: '',
};
```

#### schemaData

```jsx
import { createValidations } from 'react-form-flow';

function createRequiredValidation(message) {
  return ({ data, value, path }) => {
    const key = `${path}-required`;
    const isValid = hasValue(value);

    return { data, value, path, key, isValid, message };
  };
}

function createMinLengthValidation(min, createMessage) {
  return args => {
    const { data, value, path } = args;
    const key = `${path}-min-length`;
    const isValid = !hasValue(value) || value.length >= min;
    const { length } = value || '';
    const message = createMessage({ data, value, path, min, length });

    return { data, value, path, key, isValid, message };
  };
}

const schemaData = {
  name: createValidations(
    [],
    createRequiredValidation('Name is required!'),
    createMinLengthValidation(
      5,
      ({ length, min }) =>
        `Name should have more than ${min} characters. (Remaining ${
          length > min ? 0 : min - length
        })`
    )
  ),
  description: createValidations(
    [],
    createRequiredValidation('Description is required!'),
    createMinLengthValidation(
      300,
      ({ length, min }) =>
        `Description should have more than ${min} characters. (Remaining ${
          length > min ? 0 : min - length
        })`
    )
  ),
};
```

#### App

A few things are required in order to use the provider.

- initialData: the initial data to be rendered in the form
- schemaData: an object with validation rules per json path
- children: the react node being wrapped by the provider

```jsx
import React from 'react';
// eslint-disable-next-line
import styled from 'styled-components';
import {
  createValidations,
  FormFlowProvider,
  useFormFlowItem,
  useFormFlowValidation,
} from 'react-form-flow';
import Validation from './Validation';
import InputField from './InputField';
import schemaData from './schemaData';

const Layout = styled.div`
  height: 100%;
  width: 100%;

  display: grid;

  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
`;

function Validations() {
  const nameValidation = useFormFlowValidation('name');
  const descriptionValidation = useFormFlowItem('description');

  return (
    <div>
      <Validation label="Name" {...nameValidation} />
      <Validation label="Description" {...descriptionValidation} />
    </div>
  );
}

function Form() {
  const nameField = useFormFlowItem('name');
  const descriptionField = useFormFlowItem('description');

  return (
    <div>
      <InputField label="Name" {...nameField} />
      <InputField label="Description" {...descriptionField} />
    </div>
  );
}

function DemoApp() {
  return (
    <Layout>
      <FormFlowProvider initialData={{ name: '', description: '' }} schemaData={schemaData}>
        <Validations />
        <Form />
      </FormFlowProvider>
    </Layout>
  );
}
```

Running...

```jsx
<DemoApp />
```
