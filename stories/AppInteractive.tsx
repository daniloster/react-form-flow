import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { createValidations } from '../src';
import createRequiredValidation from '../tools/helpers/components/createRequiredValidation';
import createMinLengthValidation from '../tools/helpers/components/createMinLengthValidation';

import App from './App';

export default function AppInteractive({
  requiredNameMessage,
  requiredDescriptionMessage,
  minNameLength,
  minDescriptionLength,
}) {
  const schemaData = useMemo(
    () => ({
      name: createValidations(
        [],
        createRequiredValidation(requiredNameMessage),
        createMinLengthValidation(
          minNameLength,
          ({ length, min }) =>
            `Name should have more than ${min} characters. (Remaining ${
              length > min ? 0 : min - length
            })`
        )
      ),
      description: createValidations(
        [],
        createRequiredValidation(requiredDescriptionMessage),
        createMinLengthValidation(
          minDescriptionLength,
          ({ length, min }) =>
            `Description should have more than ${min} characters. (Remaining ${
              length > min ? 0 : min - length
            })`
        )
      ),
    }),
    [requiredNameMessage, minNameLength, requiredDescriptionMessage, minDescriptionLength]
  );

  return <App schemaData={schemaData} />;
}

AppInteractive.propTypes = {
  requiredNameMessage: PropTypes.string.isRequired,
  requiredDescriptionMessage: PropTypes.string.isRequired,
  minNameLength: PropTypes.number.isRequired,
  minDescriptionLength: PropTypes.number.isRequired,
};
