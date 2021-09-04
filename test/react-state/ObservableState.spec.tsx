import { act, fireEvent, render, screen } from '@testing-library/react';
import PropTypes from 'prop-types';
import React from 'react';
import ObservableState from '../../src/react-state/ObservableState';
import useObservableState from '../../src/react-state/useObservableState';

function factorySharedState() {
  const calcState = ObservableState.create({
    number: 1,
  });
  function useCalcState() {
    return useObservableState(calcState);
  }

  return [useCalcState, calcState];
}

function Number({ prefix, useShareState }) {
  const [state, setState] = useShareState();
  return (
    <>
      <span data-testid={`text-${prefix.replace(' ', '-')}`}>
        {prefix}
:{state.number}
      </span>
      <button
        data-testid={`id-${prefix.replace(' ', '-')}`}
        type="button"
        onClick={() => {
          setState(({ number }) => ({ number: (prefix.includes('1st') ? 10 : 20) + number }));
        }}
      >
        Increment {prefix}
      </button>
    </>
  );
}
Number.propTypes = {
  prefix: PropTypes.string.isRequired,
  useShareState: PropTypes.func.isRequired,
};

function Wrapper({ useShareState }) {
  return (
    <div>
      <Number prefix="1st Number" useShareState={useShareState} />
      <Number prefix="2nd Number" useShareState={useShareState} />
    </div>
  );
}

describe('useObservableState', () => {
  function assertValues(first: number, second: number) {
    const firstElement = screen.getByTestId('text-1st-Number');
    expect(firstElement).toBeInTheDocument();
    expect(firstElement).toHaveTextContent(`1st Number:${first}`);
    const secondElement = screen.getByTestId('text-2nd-Number');
    expect(secondElement).toBeInTheDocument();
    expect(secondElement).toHaveTextContent(`2nd Number:${second}`);
  }
  test('if useObservableState share state', () => {
    const [useShareState] = factorySharedState();
    const wrapper = render(<Wrapper useShareState={useShareState} />);
    assertValues(1, 1);
  });

  test('if useObservableState share state changed from outside', () => {
    const [useShareState, sharedState] = factorySharedState();
    const wrapper = render(<Wrapper useShareState={useShareState} />);

    act(() => {
      sharedState.set(state => ({ number: state.number + 100 }));
    });
    assertValues(101, 101);
  });

  test('if useObservableState share state changed from first internal component', async () => {
    const [useShareState] = factorySharedState();
    const wrapper = render(<Wrapper useShareState={useShareState} />);

    fireEvent.click(wrapper.getByTestId('id-1st-Number'));

    assertValues(11, 11);
  });

  test('if useObservableState share state changed from first internal component', async () => {
    const [useShareState] = factorySharedState();
    const wrapper = render(<Wrapper useShareState={useShareState} />);

    fireEvent.click(wrapper.getByTestId('id-2nd-Number'));
    
    assertValues(21, 21);
  });

  test('if ObservableState does not change after return current state', async () => {
    const initialState = { name: 'The Same' };
    const state = ObservableState.create(initialState);
    state.set(val => val);
    expect(state.get()).toBe(initialState);
  });
});
