# Input Field Recipe

The idea here is to show how to optimise your performance by reusing a input field.

## Code

Here, we are using [styled-components](https://www.styled-components.com/) for prettifying styles.

### Validation

You will probably need a component to display the validations, see the draft below.

```jsx
import React from 'react';
import styled from 'styled-components';

const ValidationLayout = styled.section`
  .ValidationLayout__message {
    color: red;
  }
`;

export default function Validation({ validations = [] }) {
  return (
    <ValidationLayout>
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
```

### InputField

In the case below, validations are received always and the consumer decides when to display them.

For this case, we are only displaying after visiting the field, but, nothing block you to pass another property `showValidation` when the form is submitted, then, it would be able to display by `{(isVisited || showValidation) && <Validation validations={validations} />}`.

```jsx
import { createValidations } from 'react-form-flow';
import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import styled from 'styled-components';
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

export default function InputField(props) {
  const { label: labelText, onChange, validations, value } = props;
  const id = useRef(uuid.v4());
  const [isVisited, setIsVisited] = useState(false);
  const onBlur = useCallback(() => {
    setIsVisited(true);
  }, []);

  return (
    <InputFieldLayout>
      <label htmlFor={id.current}>
        <span>{labelText}</span>
        <input id={id.current} type="text" onBlur={onBlur} onChange={onChange} value={value} />
      </label>
      <div className="InputFieldLayout__validations">
        {isVisited && <Validation validations={validations} />}
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
```
