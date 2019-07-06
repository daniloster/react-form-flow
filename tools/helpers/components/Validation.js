import React from 'react';
import styled from 'styled-components';

const LabelFeedback = styled.div`
  color: ${({ isColored, isValid }) => (isColored ? (isValid ? 'green' : 'red') : 'black')};
`;

const ValidationLayout = styled.section`
  .ValidationLayout__message {
    color: red;
  }
`;

export default function Validation({ isColored = false, label, validations = [] }) {
  return (
    <ValidationLayout>
      {!!label && (
        <LabelFeedback isColored={isColored} isValid={!validations.some(({ isValid }) => !isValid)}>
          {label}
        </LabelFeedback>
      )}
      {validations.map(
        ({ key, isValid, message }) =>
          !isValid && (
            <div className="ValidationLayout__message" key={key}>
              {message}
            </div>
          )
      )}
    </ValidationLayout>
  );
}
