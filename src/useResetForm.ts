import React, { useCallback, useContext, useRef } from 'react';
import FormFlowDataContext from './FormFlowDataContext';

export interface Resetable {
  reset: () => void;
}
export type ResetForm<T> = {
  onReset: () => void;
  ref: React.RefObject<T>;
};

/**
 * Creates reset form props
 */
export default function useResetForm<T extends HTMLFormElement>(): ResetForm<T> {
  const observableState = useContext(FormFlowDataContext);
  const ref = useRef<T>(null);
  const onReset = useCallback(() => {
    if (ref.current) (ref.current as HTMLFormElement).reset();
    observableState.set(metadata => ({
      ...metadata,
      values: metadata.initialValues,
    }));
  }, [observableState]);

  return { onReset, ref };
}
