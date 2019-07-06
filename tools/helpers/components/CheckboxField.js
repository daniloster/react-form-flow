import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import styled from 'styled-components';
import Validation from './Validation';

const CheckboxFieldLayout = styled.div`
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

  .CheckboxFieldLayout__validations {
    display: block;
    white-space: nowrap;
  }
`;

export default function CheckboxField({
  checkedValue,
  label: labelText,
  onChangeValue,
  validations,
  value,
}) {
  const id = useRef(uuid.v4());
  const onChange = useCallback(() => {
    const treatedValue = value || [];
    const hasValue = treatedValue.includes(checkedValue);
    const newValue = hasValue
      ? treatedValue.filter(val => val !== checkedValue)
      : treatedValue.concat(checkedValue);

    onChangeValue(newValue);
  }, [checkedValue, onChangeValue, value]);

  return (
    <CheckboxFieldLayout>
      <label htmlFor={id.current}>
        <span>{labelText}</span>
        <input
          id={id.current}
          type="checkbox"
          onChange={onChange}
          checked={(value || []).includes(checkedValue)}
        />
      </label>
      <div className="CheckboxFieldLayout__validations">
        <Validation validations={validations} />
      </div>
    </CheckboxFieldLayout>
  );
}

CheckboxField.propTypes = {
  checkedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
    .isRequired,
  label: PropTypes.string,
  onChangeValue: PropTypes.func.isRequired,
  validations: PropTypes.arrayOf(PropTypes.shape({})),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.any),
  ]),
};

CheckboxField.defaultProps = {
  label: null,
  validations: [],
  value: '',
};
