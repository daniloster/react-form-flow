import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import FormFlowDataContext from './FormFlowDataContext';
import FormFlowValidationContext from './FormFlowValidationContext';
import useFormFlowValidation from './useFormFlowValidation';
import { interpolatePaths } from './validationUtils';
import { SchemaDataShape } from './shapes';

function Validate({ path }) {
  useFormFlowValidation(path);

  return null;
}

Validate.propTypes = {
  /**
   * JsonPath to validate in the form
   */
  path: PropTypes.string.isRequired,
};

export default function FormFlowProvider({ children, initialData, schemaData }) {
  const dataState = useState(initialData);
  const [data] = dataState;
  const validationState = useMemo(() => [schemaData, {}], [schemaData]);
  const allPaths = useMemo(() => interpolatePaths(schemaData, data), [schemaData, data]);

  /**
   * Basically, we need to clear out the pre-existing validation as it can only
   * be trigger by data or schemaData changes which would invalidate the form validations.
   */
  validationState[1].allPaths = allPaths;
  validationState[1].allValidations = [];
  validationState[1].byPath = {};

  return (
    <FormFlowDataContext.Provider value={dataState}>
      <FormFlowValidationContext.Provider value={validationState}>
        {allPaths.map(path => (
          <Validate key={path} path={path} />
        ))}
        {children}
      </FormFlowValidationContext.Provider>
    </FormFlowDataContext.Provider>
  );
}

FormFlowProvider.propTypes = {
  /**
   * React.Node where the form fields are rendered
   */
  children: PropTypes.node.isRequired,
  /**
   * The initial form data
   */
  initialData: PropTypes.shape({}).isRequired,
  /**
   * The object with validation rules per field
   */
  schemaData: PropTypes.objectOf(SchemaDataShape).isRequired,
};
