import React from 'react';
// eslint-disable-next-line
import styled from 'styled-components';
import { FormFlowProvider, useFormFlowItem, useFormFlowValidation } from '../src';
import Validation from '../tools/helpers/components/Validation';
import InputField from '../tools/helpers/components/InputField';

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

export default ({ schemaData }) => (
  <Layout>
    <FormFlowProvider initialData={{}} schemaData={schemaData}>
      <Validations />
      <Form />
    </FormFlowProvider>
  </Layout>
);
