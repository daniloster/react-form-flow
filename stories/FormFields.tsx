import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FormFlowProvider, createValidations } from '../src';
import createRequiredValidation from '../react-form-flow-examples/validationRecipes/createRequiredValidation';
import createMinLengthValidation from '../react-form-flow-examples/validationRecipes/createMinLengthValidation';
import createMaxLengthValidation from '../react-form-flow-examples/validationRecipes/createMaxLengthValidation';
import createRequiredListValidation from '../react-form-flow-examples/validationRecipes/createRequiredListValidation';

const schemaData = {
  name: createValidations(
    [],
    createRequiredValidation('Name is required!'),
    createMinLengthValidation(
      5,
      ({ length, min }) =>
        `Name should have more than ${min} characters. (Remaining ${
          length > min ? 0 : min - length
        })`
    )
  ),
  description: createValidations(
    [],
    createRequiredValidation('Description is required!'),
    createMaxLengthValidation(
      300,
      ({ length, max }) =>
        `Description should have less than ${max} characters. (Beyond ${
          length > max ? max - length : 0
        })`
    )
  ),
  skills: createValidations([], createRequiredListValidation('Selected at least one skill.')),
  hobbies: createValidations([], createRequiredListValidation('Selected at least one hobby.')),
};

const RecipesFieldsLayout = styled.div``;

export default function FormFields(props) {
  const { children } = props;
  const initialData = {
    name: '',
    description: '',
    skills: [],
    hobbies: [],
    gender: {
      visa: {
        value: 3,
        unit: 'days',
      },
    },
  };

  return (
    <RecipesFieldsLayout>
      <FormFlowProvider initialData={initialData} schemaData={schemaData}>
        {children}
      </FormFlowProvider>
    </RecipesFieldsLayout>
  );
}

FormFields.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.shape({}).isRequired,
};
