import { FormEvent, FormEventHandler, useCallback, useContext } from 'react';
import FormFlowDataContext from './FormFlowDataContext';
import isValidByPaths from './isValidByPaths';
import ValidationState from './SchemaBuilder/ValidationState';

type SubmissionMetadata = ValidationState & { isValid: boolean; e: FormEvent };
type SubmitHandler = (values: any, metadata: SubmissionMetadata) => void;

/**
 * Creates properties to handle form submission
 */
export default function useSubmitForm(submit: SubmitHandler): { onSubmit: FormEventHandler<HTMLFormElement> } {
  const observableState = useContext(FormFlowDataContext);
  const onSubmit = useCallback(
    async e => {
      e.preventDefault();
      const { values, validationsState } = observableState.get();
      const { allValidations } = validationsState;
      const isValid = isValidByPaths(allValidations);
      observableState.set(oldData => ({
        ...oldData,
        submitCount: oldData.submitCount + 1,
      }));

      await submit(values, { ...validationsState, isValid, e });

      return false;
    },
    [observableState, submit]
  );

  return { onSubmit };
}
