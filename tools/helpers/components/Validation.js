import React from 'react';
import styled from 'styled-components';

const LabelFeedback = styled.div`
  color: ${({ isColored, isValid }) => (isColored ? (isValid ? 'green' : 'red') : 'black')};
`;

export default function Validation({ isColored = false, label, validations = [] }) {
  return (
    <section>
      {!!label && (
        <LabelFeedback isColored={isColored} isValid={!validations.some(({ isValid }) => !isValid)}>
          {label}
        </LabelFeedback>
      )}
      {validations.map(({ key, isValid, message }) => !isValid && <div key={key}>{message}</div>)}
    </section>
  );
}
