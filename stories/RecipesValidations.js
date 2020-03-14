import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import Validation from '../react-form-flow-examples/fields/Validation';
import { FormFlowProvider, useFormFlowItem, useFormFlowValidation } from '../src';

function UpdateData({ data }) {
  const { setData } = useFormFlowItem();

  useEffect(() => {
    setData(data);
  }, [data, setData]);

  return null;
}

const ValidationsLayout = styled.div`
  hr:last-child {
    display: none;
  }
`;

function Validations({ schemaData }) {
  const { validations } = useFormFlowValidation();

  return (
    <ValidationsLayout>
      {Object.keys(schemaData).map(jsonPath => (
        <React.Fragment>
          <Validation
            isColored
            key={jsonPath}
            label={jsonPath}
            errors={validations.filter(({ path, isValid }) => jsonPath === path && !isValid)}
          />
          <hr />
        </React.Fragment>
      ))}
    </ValidationsLayout>
  );
}

export default function RecipesValidations({ data, schemaData }) {
  return (
    <FormFlowProvider initialData={data} schemaData={schemaData}>
      <h2>Try change the validations or the data in the console below...</h2>
      <UpdateData data={data} />
      <Validations schemaData={schemaData} />
    </FormFlowProvider>
  );
}

RecipesValidations.propTypes = {
  data: PropTypes.shape({}).isRequired,
  schemaData: PropTypes.shape({}).isRequired,
};
