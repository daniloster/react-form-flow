import { useCallback, useContext, useRef } from 'react';
import FormFlowDataContext from './FormFlowDataContext';
import FormFlowValidationContext from './FormFlowValidationContext';
import validate from './validate';

/**
 * @typedef ResetProps
 * @property {function} onReset - the event handler
 * @property {React.MutableRefObject} ref - the reference to the form
 */

/**
 * Creates reset form props
 * @returns {ResetProps} - these props should be spread on the form element
 */
export default function useResetForm() {
  const observableState = useContext(FormFlowDataContext);
  const observableStateValidations = useContext(FormFlowValidationContext);
  const ref = useRef(null);
  const onReset = useCallback(() => {
    ref.current.reset();
    observableState.set(metadata => ({
      ...metadata,
      values: metadata.initialValues,
    }));
    const { initialValues } = observableState.get();
    observableStateValidations.set(({ schemaData }) => validate(schemaData, initialValues));
  }, [observableState, observableStateValidations]);

  return { onReset, ref };
}
