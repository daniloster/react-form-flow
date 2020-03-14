import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import hasValue from '../react-form-flow-examples/validationRecipes/hasValue';
import { createValidations } from '../src';
import RecipesValidations from './RecipesValidations';

function decode(text) {
  const parser = document.createElement('div');

  parser.innerHTML = text;
  return parser.textContent;
}

function parse(text) {
  return JSON.parse(decode(text));
}

export default function RecipesValidationsInteractive({ data, factories, schemaData }) {
  const [_data, set_data] = useState(data);
  const [_factories, set_factories] = useState(data);
  const [_schemaData, set_schemaData] = useState(data);
  const newData = parse(data);
  // eslint-disable-next-line
  const getSchemaData = new Function(
    'createValidations',
    'hasValue',
    `${decode(factories)} return ${decode(schemaData)};`
  );

  useEffect(() => {
    set_data(data);
    set_factories(factories);
    set_schemaData(schemaData);
  }, [data, factories, schemaData]);

  return (
    _data === data &&
    _factories === factories &&
    _schemaData === schemaData && (
      <RecipesValidations data={newData} schemaData={getSchemaData(createValidations, hasValue)} />
    )
  );
}

RecipesValidationsInteractive.propTypes = {
  data: PropTypes.string.isRequired,
  factories: PropTypes.string.isRequired,
  schemaData: PropTypes.string.isRequired,
};
