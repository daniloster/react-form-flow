import React from 'react';
import PropTypes from 'prop-types';
import { createValidations } from '../src';
import RecipesValidations from './RecipesValidations';
import hasValue from '../tools/helpers/components/hasValue';

function decode(text) {
  const parser = document.createElement('div');

  parser.innerHTML = text;
  return parser.textContent;
}

function parse(text) {
  return JSON.parse(decode(text));
}

export default function RecipesValidationsInteractive({ data, factories, schemaData }) {
  const newData = parse(data);
  // eslint-disable-next-line
  const getSchemaData = new Function(
    'createValidations',
    'hasValue',
    `${decode(factories)} return ${decode(schemaData)};`
  );

  return (
    <RecipesValidations data={newData} schemaData={getSchemaData(createValidations, hasValue)} />
  );
}

RecipesValidationsInteractive.propTypes = {
  data: PropTypes.string.isRequired,
  factories: PropTypes.string.isRequired,
  schemaData: PropTypes.string.isRequired,
};
