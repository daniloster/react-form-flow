import React from 'react';

export default function Validation({ label, validations }) {
  return (
    <section>
      {!!label && <div>{label}</div>}
      {validations.map(({ key, isValid, message }) => !isValid && <div key={key}>{message}</div>)}
    </section>
  );
}
