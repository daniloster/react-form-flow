import { useContext, useMemo } from 'react';
import FormFlowDataContext from './FormFlowDataContext';
import { useObservableState } from './react-state';
import wrapSchemaWithValidationMethods from './SchemaBuilder/wrapSchemaWithValidationMethods';

export default function EvaluateValidations() {
  const observableState = useContext(FormFlowDataContext);
  const [state] = useObservableState(observableState);
  const { schemaData, values: data } = state;
  const schema = useMemo(
    () =>
      typeof schemaData.validate === 'function'
        ? schemaData
        : wrapSchemaWithValidationMethods(schemaData),
    [schemaData]
  );
  const { validationsState } = observableState.get();
  /**
   * Basically, we need to clear out the pre-existing validation as it can only
   * be trigger by data or schemaData changes which would invalidate the form validations.
   */
  const globalValidationCached = schema.validate(data);
  validationsState.allPaths = globalValidationCached.allPaths;
  validationsState.allValidations = globalValidationCached.allValidations;
  validationsState.byPath = globalValidationCached.byPath;

  return null;
}
