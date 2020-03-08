import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useRef } from 'react';
import EvaluateValidations from './EvaluateValidations';
import FormFlowDataContext from './FormFlowDataContext';
import isValidByPaths from './isValidByPaths';
import { ObservableState } from './react-state';
import { SchemaDataShape } from './shapes';

function FormFlowProvider({ children, initialData, schemaData, isSubmitted = false }) {
  const initialDataRef = useRef(initialData);
  const schemaDataRef = useRef(schemaData);
  const observableState = useMemo(
    () =>
      ObservableState.create({
        submitCount: isSubmitted ? 1 : 0,
        dirty: {},
        initialValues: initialDataRef.current,
        schemaData: schemaDataRef.current,
        touched: {},
        values: initialDataRef.current,
        validationsState: {
          allPaths: [],
          allValidations: [],
          byPath: {},
        },
      }),
    [isSubmitted]
  );
  observableState.get().validationsState.isAllValid = useCallback(
    paths => {
      const { allValidations } = observableState.get().validationsState;
      return isValidByPaths(allValidations, paths);
    },
    [observableState]
  );

  return (
    <FormFlowDataContext.Provider value={observableState}>
      <EvaluateValidations />
      {children}
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
   * Indicates when the data has been created or there was an attempt to create it
   */
  isSubmitted: PropTypes.bool,
  /**
   * The object with validation rules per field
   */
  schemaData: PropTypes.objectOf(SchemaDataShape).isRequired,
};

export default React.memo(FormFlowProvider);
