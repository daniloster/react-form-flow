import { render, waitForElement } from '@testing-library/react';
import React, { useEffect, useRef, useState } from 'react';
import { dispatchChange } from '../src';

describe('dispatchChange', () => {
  function Input({ collectRef, ...props }) {
    const ref = useRef(null);
    const [value, setValue] = useState('');
    useEffect(() => {
      collectRef(ref);
    }, [collectRef]);

    return <div>
      <input type="text" {...props} ref={ref} value={value} onChange={e => setValue(e.target.value)} />
      <span data-testid="updated-state">{value}</span>
    </div>
  }

  test('if input is changed from outside', async () => {
    let ref;
    function collectRef(_ref) {
      ref = _ref;
    }
    const wrapper = render(<Input collectRef={collectRef} />)
    dispatchChange(ref.current, 'New Value');
    const node = await waitForElement(() => wrapper.getByTestId('updated-state'));
    expect(node.textContent).toEqual('New Value');
  });
});
