import { act, fireEvent, render, waitForElement } from '@testing-library/react'
import PropTypes from 'prop-types'
import React from 'react'
import ObservableState from '../../src/react-state/ObservableState'
import useObservableState from '../../src/react-state/useObservableState'

function factorySharedState() {
  const calcState = ObservableState.create({
    number: 1,
  })
  function useCalcState() {
    return useObservableState(calcState)
  }

  return [useCalcState, calcState]
}

function Number({ prefix, useShareState }) {
  const [state, setState] = useShareState()
  return (
    <>
      <span>
        {prefix}: {state.number}
      </span>
      <button
        data-testid={'id-' + prefix.replace(' ', '-')}
        type="button"
        onClick={() => {
          setState(({ number }) => ({ number: (prefix.includes('1st') ? 10 : 20) + number }))
        }}
      >
        Increment {prefix}
      </button>
    </>
  )
}
Number.propTypes = {
  prefix: PropTypes.string.isRequired,
  useShareState: PropTypes.func.isRequired,
}

function Wrapper({ useShareState }) {
  return (
    <div>
      <Number prefix="1st Number" useShareState={useShareState} />
      <Number prefix="2nd Number" useShareState={useShareState} />
    </div>
  )
}
Wrapper.propTypes = {
  useShareState: PropTypes.func.isRequired,
}

describe('useObservableState', () => {
  test('if useObservableState share state', () => {
    const [useShareState] = factorySharedState()
    const wrapper = render(<Wrapper useShareState={useShareState} />)

    expect(wrapper.getByText(/1st number: 1/i)).toBeInTheDocument()
    expect(wrapper.getByText(/2nd number: 1/i)).toBeInTheDocument()
  })

  test('if useObservableState share state changed from outside', () => {
    const [useShareState, sharedState] = factorySharedState()
    const wrapper = render(<Wrapper useShareState={useShareState} />)

    act(() => {
      sharedState.set(state => ({ number: state.number + 100 }))
    })
    expect(wrapper.getByText(/1st number: 101/i)).toBeInTheDocument()
    expect(wrapper.getByText(/2nd number: 101/i)).toBeInTheDocument()
  })

  test('if useObservableState share state changed from first internal component', async () => {
    const [useShareState] = factorySharedState()
    const wrapper = render(<Wrapper useShareState={useShareState} />)

    fireEvent.click(wrapper.getByTestId('id-1st-Number'))
    expect(await waitForElement(() => wrapper.getByText(/1st number: 11/i))).toBeInTheDocument()
    expect(await waitForElement(() => wrapper.getByText(/2nd number: 11/i))).toBeInTheDocument()
  })

  test('if useObservableState share state changed from first internal component', async () => {
    const [useShareState] = factorySharedState()
    const wrapper = render(<Wrapper useShareState={useShareState} />)

    fireEvent.click(wrapper.getByTestId('id-2nd-Number'))
    expect(await waitForElement(() => wrapper.getByText(/1st number: 21/i))).toBeInTheDocument()
    expect(await waitForElement(() => wrapper.getByText(/2nd number: 21/i))).toBeInTheDocument()
  })

  test('if ObservableState does not change after return current state', async () => {
    const initialState = { name: 'The Same' }
    const state = ObservableState.create(initialState)
    state.set(val => val)
    expect(state.get()).toBe(initialState)
  })
})
