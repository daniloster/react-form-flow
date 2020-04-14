import { useCallback, useContext } from 'react';
import FormFlowDataContext from './FormFlowDataContext';
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
