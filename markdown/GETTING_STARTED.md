### How to use it

Define your form data wrapping with the container below.

```js
import FormFlowProvider from 'react-form-flow';
// or
import { FormFlowProvider } from 'react-form-flow';
```

Use hooks to get values, event handler and validations.

```html
import { useFormFlowField, useFormFlowValidation } from 'react-form-flow';
```

## Getting started

`react-form-flow` as its name describes is a library to define a common and automated workflow to collect and validate form data. Allow user to consume the data and validation based on the json path.

To improve your productivity, it would be good to create your core form components such as input, dropdowns and on and on following the `react-form-flow` spec.

[Code Sandbox Example](https://codesandbox.io/s/dreamy-bird-mnftf)

We also have an older version using a [base hooks](https://github.com/daniloster/react-form-flow/blob/master/markdown/baseUsage/GETTING_STARTED_WITH_USE_FORM_FLOW_ITEM.md), it is useful for more advanced and custom usage. In most of the form cases, the current documentation is better option.

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

export default function Validation({ errors }) {
  return (
    <section>
      {validations.map(({ key, message }) => <div key={key}>{message}</div>)}
    </section>
  );
}
```

### InputField

The input field could receive from the `useFormFlowField` an object with the spec below.

```ts
interface FormFlowField {
  dirty: boolean;
  errors: Array<ValidationResult>;
  field: FieldMetadata;
  submitted: boolean;
  touched: boolean;
}
```

Validation returned can match whatever you want, for the sake of standard, let's always return this below.

```ts
interface ValidationResult {
  data: object;
  key: string;
  isValid: boolean;
  message: string|React.ReactNode;
  path: string;
  value: any;
}
```

And, finally, the field would have these properties.

```ts
interface FieldMetadata {
  /**
   * Depending on the eventType passed to useFormFlowField, it returns
   * either onChange or onChangeValue.
   * */
  onChange(e: Event): void;
  onChangeValue(value: any): void;
  /**
   * Common properties
   * */
  onBlur(e: Event): void;
  value: any;
}
```

Component...

```jsx
import React from 'react';
import Validation from './Validation';

export default function InputField({
  errors,
  field,
  label,
  touched,
  submitted,
  value,
}) {
  return (
    <div>
      <div>{label}</div>
      <input type="text" {...field} />
      <div>
        {(submitted || touched) && <Validation validations={errors} />}
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

    /* @type {Validation} */
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

    /* @type {Validation} */
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

A few things are required in order to use the `react-form-flow` library.

- initialData: the initial data to be rendered in the form
- schemaData: an object with validation rules per json path
- children: the react node being wrapped by the provider containing the real form within fields

```jsx
import React from 'react';
// eslint-disable-next-line
import styled from 'styled-components';
import {
  createValidations,
  FormFlowProvider,
  useFormFlowField,
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

function Form() {
  const name = useFormFlowField('name');
  const description = useFormFlowField('description');

  return (
    <div>
      <InputField label="Name" {...name} />
      <InputField label="Description" {...description} />
    </div>
  );
}

function DemoApp() {
  return (
    <Layout>
      <FormFlowProvider initialData={{ name: '', description: '' }} schemaData={schemaData}>
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
