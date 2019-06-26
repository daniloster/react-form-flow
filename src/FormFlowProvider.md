### FormFlowProvider

Define your form data wrapping with the container below.

```html
import FormFlowProvider from 'react-form-flow';
```

A few things are required in order to use the provider.

- initialData: the initial data to be rendered in the form
- schemaData: an object with validation rules per json path
- children: the react node being wrapped by the provider

More about [schemaData](./docs/SCHEMA_DATA.md)

#### schemaData

```js static
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

```js static
import React from 'react';
// eslint-disable-next-line
import styled from 'styled-components';
import {
  createValidations,
  FormFlowProvider,
  useFormFlowItem,
  useFormFlowValidation,
} from 'react-form-flow';
import schemaData from './schemaData';

/**
 * Note: assume these below exist (you will find the implementation
 * at GETTING_STARTED section
 * */
import Validation from './Validation';
import InputField from './InputField';
/* end note */

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
  const initialData = { name: '', description: 'Some value in it' };
  return (
    <Layout>
      <FormFlowProvider initialData={initialData} schemaData={schemaData}>
        <Validations />
        <Form />
      </FormFlowProvider>
    </Layout>
  );
}
```

Running...

```js static
<DemoApp />
```
