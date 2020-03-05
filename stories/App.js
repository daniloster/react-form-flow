import React from 'react';
// eslint-disable-next-line
import styled from 'styled-components';
import { FormFlowProvider, useFormFlowItem, useFormFlowValidation, useResetForm, useSubmitForm } from '../src';
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
  const submissionProps = useSubmitForm(data => {
    console.log(data);
  });
  const resetProps = useResetForm();

  return (
    <form {...submissionProps} {...resetProps}>
      <InputField label="Name" {...nameField} />
      <InputField label="Description" {...descriptionField} />
      <button type="reset">Reset</button>
      <button type="submit">Submit</button>
    </form>
  );
}

export default ({ schemaData }) => (
  <Layout>
    <FormFlowProvider
      initialData={{}}
      schemaData={schemaData}
      onSubmit={async data => {
        console.log(data);
      }}
    >
      <Validations />
      <Form />
    </FormFlowProvider>
  </Layout>
);
