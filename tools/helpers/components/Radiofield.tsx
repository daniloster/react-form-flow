import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import styled from 'styled-components';
import Validation from './Validation';

const RadioFieldLayout = styled.div`
  padding: 0 0 10px 0;
  display: grid;
  grid-template-columns: min-content;
  grid-template-rows: min-content auto;

  label {
    display: grid;
    grid-template-columns: min-content min-content;
    grid-template-rows: auto;
    white-space: nowrap;
    grid-gap: 10px;
  }

  .RadioFieldLayout__validations {
    display: block;
    white-space: nowrap;
  }
`;

export default function RadioField({
  checkedValue,
  name,
  label: labelText,
  onChangeValue,
  validations,
  value,
}) {
  const id = useRef(uuid.v4());
  const onChange = useCallback(() => {
    onChangeValue(checkedValue);
  }, [checkedValue, onChangeValue]);

  return (
    <RadioFieldLayout>
      <label htmlFor={id.current}>
        <span>{labelText}</span>
        <input
          id={id.current}
          name={name}
          type="radio"
          onChange={onChange}
          checked={value === checkedValue}
        />
      </label>
      <div className="RadioFieldLayout__validations">
        <Validation validations={validations} />
      </div>
    </RadioFieldLayout>
  );
}

RadioField.propTypes = {
  checkedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
    .isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  onChangeValue: PropTypes.func.isRequired,
  validations: PropTypes.arrayOf(PropTypes.shape({})),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
};

RadioField.defaultProps = {
  label: null,
  validations: [],
  value: '',
};
