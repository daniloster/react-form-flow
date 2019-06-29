import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { parse } from 'ipaddr.js';
import {
  FormFlowProvider,
  useFormFlowItem,
  useFormFlowValidation,
  createValidations,
} from '../src';
import Validation from '../tools/helpers/components/Validation';
import RecipesValidations from './RecipesValidations';

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

export default function RecipesValidationsInteractive({ data, schemaData }) {
  const newData = parse(data);
  const getSchemaData = new Function(
    `const createValidations = arguments[0]; return ${schemaData};`
  );

  return <RecipesValidations data={newData} schemaData={getSchemaData(createValidations)} />;
}

RecipesValidationsInteractive.propTypes = {
  data: PropTypes.shape({}).isRequired,
  schemaData: PropTypes.shape({}).isRequired,
};
