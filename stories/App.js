import React from 'react';
// eslint-disable-next-line
import styled from 'styled-components';
import InputField from '../react-form-flow-examples/fields/InputField';
import Validation from '../react-form-flow-examples/fields/Validation';
import { FormFlowProvider, useFormFlowField, useResetForm, useSubmitForm } from '../src';

const Layout = styled.div`
  height: 100%;
  width: 100%;

  display: grid;

  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
`;

function Validations() {
  const name = useFormFlowField('name');
  const description = useFormFlowField('description');

  return (
    <div>
      {(name.submitted || name.touched) && <Validation label="Name" errors={name.errors} />}
      {(description.submitted || description.touched) && (
        <Validation label="Description" errors={description.errors} />
      )}
    </div>
  );
}

function Form() {
  const name = useFormFlowField('name');
  const description = useFormFlowField('description');
  const submissionProps = useSubmitForm(data => {
    console.log(data);
  });
  const resetProps = useResetForm();

  return (
    <form {...submissionProps} {...resetProps}>
      <InputField label="Name" {...name} />
      <InputField label="Description" {...description} />
      {/* eslint-disable-next-line react/button-has-type */}
      <button type="reset">Reset</button>
      <button type="submit">Submit</button>
    </form>
  );
}

export default ({ schemaData }) => (
  <Layout>
    <FormFlowProvider initialData={{}} schemaData={schemaData}>
      <Validations />
      <Form />
    </FormFlowProvider>
  </Layout>
);
