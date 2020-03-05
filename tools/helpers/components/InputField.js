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
    display: block;
  }
`;

export default React.memo(InputField);

function InputField({ label: labelText, onChange, validations, value }) {
  const id = useRef(uuid.v4());

  return (
    <InputFieldLayout>
      <label htmlFor={id.current}>
        <span>{labelText}</span>
        <input id={id.current} type="text" onChange={onChange} value={value} />
      </label>
      <div className="InputFieldLayout__validations">
        <Validation validations={validations} />
      </div>
    </InputFieldLayout>
  );
}

InputField.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validations: PropTypes.arrayOf(PropTypes.shape({})),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

InputField.defaultProps = {
  label: null,
  validations: [],
  value: '',
};
