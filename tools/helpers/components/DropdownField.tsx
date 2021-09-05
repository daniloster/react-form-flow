import PropTypes from 'prop-types';
import React, { useCallback, useRef } from 'react';
import styled from 'styled-components';
import uuid from 'uuid';
import Validation from './Validation';

const DropdownFieldLayout = styled.div`
  padding: 0 0 10px 0;
  display: grid;
  grid-template-columns: min-content;
  grid-template-rows: min-content auto;

  label {
    display: grid;
    grid-template-columns: min-content;
    grid-template-rows: min-content min-content min-content;
    white-space: nowrap;
    grid-gap: 10px;
  }

  .DropdownFieldLayout__validations {
    display: ${({ touched }) => (touched ? 'block' : 'none')};
    white-space: nowrap;
  }
`;

export default function DropdownField({
  dirty = false,
  empty,
  formatText,
  formatValue,
  label: labelText,
  onChangeValue,
  options,
  touched = true,
  validations,
  value,
}) {
  const id = useRef(uuid.v4());
  const onChange = useCallback(
    e => {
      const { value: optionValue } = e.target;

      onChangeValue(options.find(option => formatValue(option) === optionValue) || '');
    },
    [formatValue, onChangeValue, options]
  );

  return (
    <DropdownFieldLayout dirty={dirty} touched={touched}>
      <label htmlFor={id.current}>
        <span>{labelText}</span>
        <select onChange={onChange} value={formatValue(value)}>
          {empty && <option value={formatValue(empty)}>{formatText(empty)}</option>}
          {Boolean(options && options.length) &&
            options.map(option => {
              const text = formatText(option);
              const optionValue = formatValue(option);

              return (
                <option key={optionValue} value={optionValue}>
                  {text}
                </option>
              );
            })}
        </select>
      </label>
      <div className="DropdownFieldLayout__validations">
        <Validation validations={validations} />
      </div>
    </DropdownFieldLayout>
  );
}

DropdownField.propTypes = {
  dirty: PropTypes.bool,
  empty: PropTypes.oneOf([PropTypes.any]),
  formatText: PropTypes.func.isRequired,
  formatValue: PropTypes.func.isRequired,
  label: PropTypes.string,
  onChangeValue: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  touched: PropTypes.bool,
  validations: PropTypes.arrayOf(PropTypes.shape({})),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
};

DropdownField.defaultProps = {
  empty: null,
  label: null,
  validations: [],
  value: '',
};
