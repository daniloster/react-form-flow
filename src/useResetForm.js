import { useCallback, useContext, useRef } from 'react';
import FormFlowDataContext from './FormFlowDataContext';

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
  const ref = useRef(null);
  const onReset = useCallback(() => {
    ref.current.reset();
    observableState.set(metadata => ({
      ...metadata,
      values: metadata.initialValues,
    }));
  }, [observableState]);

  return { onReset, ref };
}
