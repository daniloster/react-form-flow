import React from 'react';
// eslint-disable-next-line
import styled from 'styled-components';
import { FormFlowProvider, useFormFlowField, useResetForm, useSubmitForm } from '../src';
import InputField from '../tools/helpers/components/InputField';
import Validation from '../tools/helpers/components/Validation';

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
      {name.touched && <Validation label="Name" validations={name.errors} />}
      {description.touched && <Validation label="Description" validations={description.errors} />}
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
      <InputField label="Name" {...name.field} />
      <InputField label="Description" {...description.field} />
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
