import React, { useCallback, useMemo, useRef } from 'react';
import EvaluateValidations from './EvaluateValidations';
import FormFlowDataContext from './FormFlowDataContext';
import FormFlowDataType from './FormFlowDataType';
import isValidByPaths from './isValidByPaths';
import { ObservableState } from './react-state';
import SchemaData from './SchemaBuilder/SchemaData';

type FormFlowProviderProps = {
  /**
   * React.Node where the form fields are rendered
   */
  children: React.ReactElement | React.ReactNode;
  /**
    * The initial form data
    */
  initialData: Object;
  /**
    * The object with validation rules per field
    */
  schemaData: SchemaData;
  /**
    * Indicates when the data has been created or there was an attempt to create it
    */
  isSubmitted?: boolean;
};

function FormFlowProvider({
  children,
  initialData,
  schemaData,
  isSubmitted = false,
}: FormFlowProviderProps): React.ReactElement {
  const initialDataRef = useRef(initialData);
  const schemaDataRef = useRef(schemaData);
  const observableState = useMemo(
    () =>
      ObservableState.create<FormFlowDataType>({
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
          isAllValid: (paths: string[]) => Boolean(paths),
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
      <>{children}</>
    </FormFlowDataContext.Provider>
  );
}

export default React.memo(FormFlowProvider);
