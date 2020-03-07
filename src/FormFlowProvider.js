import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef } from 'react';
import FormFlowDataContext from './FormFlowDataContext';
import FormFlowValidationContext from './FormFlowValidationContext';
import { ObservableState } from './react-state';
import { SchemaDataShape } from './shapes';
import validate from './validate';

function FormFlowProvider({ children, initialData, schemaData }) {
  const initialDataRef = useRef(initialData);
  const schemaDataRef = useRef(schemaData);
  const observableState = useMemo(
    () =>
      ObservableState.create({
        initialValues: initialDataRef.current,
        values: initialDataRef.current,
      }),
    []
  );
  const observableStateValidations = useMemo(
    () =>
      ObservableState.create({
        allPaths: [],
        allValidations: [],
        byPath: {},
        invalidationRules: {},
      }),
    []
  );

  useEffect(() => {
    observableStateValidations.set(() => validate(schemaDataRef.current, initialDataRef.current));
  }, [observableStateValidations]);

  return (
    <FormFlowDataContext.Provider value={observableState}>
      <FormFlowValidationContext.Provider value={observableStateValidations}>
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

export default React.memo(FormFlowProvider);
