import { useCallback, useContext } from 'react';
import FormFlowDataContext from './FormFlowDataContext';
import FormFlowValidationContext from './FormFlowValidationContext';
import isValidByPaths from './isValidByPaths';

/**
 * @typedef SubmissionProps
 * @property {function} onSubmit - the event handler to submit the form data
 */

/**
 * Creates properties to handle form submission
 * @param {function} submit - the function to submit the form data
 * e.g. Function(data, validationsMetadata): Promise
 * @returns {SubmissionProps}
 */
export default function useSubmitForm(submit) {
  const observableState = useContext(FormFlowDataContext);
  const observableStateValidations = useContext(FormFlowValidationContext);
  const onSubmit = useCallback(
    async e => {
      e.preventDefault();
      const { values } = observableState.get();
      const validationsMetadata = observableStateValidations.get();
      const { allValidations } = validationsMetadata;
      const isValid = isValidByPaths(allValidations);

      await submit(values, { ...validationsMetadata, isValid });

      return false;
    },
    [observableState, observableStateValidations, submit]
  );

  return { onSubmit };
}
