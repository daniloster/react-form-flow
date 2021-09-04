import { useContext, useMemo } from 'react';
import FormFlowDataContext from './FormFlowDataContext';
import FormFlowDataType from './FormFlowDataType';
import { useObservableState } from './react-state';
import AggregatedValidator from './SchemaBuilder/AggregatedValidator';
import SchemaValidationMethods from './SchemaBuilder/SchemaValidationMethods';
import wrapSchemaWithValidationMethods from './SchemaBuilder/wrapSchemaWithValidationMethods';

export default function EvaluateValidations() {
  const observableState = useContext(FormFlowDataContext);
  const [state] = useObservableState(observableState);
  const { schemaData, values: data } = state as FormFlowDataType;
  const schema = useMemo(
    () =>
      typeof ((schemaData as any).validate) === 'function'
        ? schemaData
        : wrapSchemaWithValidationMethods(schemaData as {
          [key: string]: AggregatedValidator;
        }),
    [schemaData]
  ) as SchemaValidationMethods;
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
