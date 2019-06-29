import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormFlowProvider, useFormFlowItem, useFormFlowValidation } from '../src';
import Validation from '../tools/helpers/components/Validation';

function UpdateData({ data }) {
  const { setData } = useFormFlowItem();

  useEffect(() => {
    setData(data);
  }, [data, setData]);
}

function Validations() {
  const { validations } = useFormFlowValidation();

  return (
    <div>
      {validations.map(({ key, path, ...validation }) => (
        <Validation key={key} label={path} {...validation} />
      ))}
    </div>
  );
}

export default function RecipesValidations({ data, schemaData }) {
  return (
    <FormFlowProvider initialData={data} schemaData={schemaData}>
      <UpdateData data={data} />
      <Validations />
    </FormFlowProvider>
  );
}

RecipesValidations.propTypes = {
  data: PropTypes.shape({}).isRequired,
  schemaData: PropTypes.shape({}).isRequired,
};
