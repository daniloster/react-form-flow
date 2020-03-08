import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import styled from 'styled-components';
import uuid from 'uuid';
import Validation from './Validation';

const InputFieldLayout = styled.div`
  padding: 0 0 10px 0;
  label > span {
    display: block;
  }
  .InputFieldLayout__validations {
    display: ${({ touched }) => (touched ? 'block' : 'none')};
  }
`;

function InputField({
  dirty = false,
  label: labelText,
  onBlur,
  onChange,
  touched = true,
  validations,
  value,
}) {
  const id = useRef(uuid.v4());

  return (
    <InputFieldLayout dirty={dirty} touched={touched}>
      <label htmlFor={id.current}>
        <span>{labelText}</span>
        <input
          id={id.current}
          type="text"
          onBlur={onBlur || (() => true)}
          onChange={onChange}
          value={value}
        />
      </label>
      <div className="InputFieldLayout__validations">
        <Validation validations={validations} />
      </div>
    </InputFieldLayout>
  );
}

InputField.propTypes = {
  dirty: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  touched: PropTypes.bool,
  validations: PropTypes.arrayOf(PropTypes.shape({})),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

InputField.defaultProps = {
  label: null,
  validations: [],
  value: '',
};

export default React.memo(InputField);
