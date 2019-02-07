/* eslint-env jest */
import React from 'react';
import {act, cleanup, fireEvent, render, testHook} from 'react-testing-library';
import {Container, Provider, useStore} from '../src';

class CounterContainer extends Container {
  state = {count: 0};

  increment = (amount = 1) => {
    this.setState({count: this.state.count + amount});
  };

  decrement = (amount = 1) => {
    this.setState({count: this.state.count - amount});
  };
}

function Counter({store}) {
  const [state, setState, counter] = useStore(store);

  const updateState = () => setState({count: 100});

  return (
    <div>
      <span>{state.count}</span>
      <button onClick={() => counter.decrement()}>-</button>
      <button onClick={() => counter.increment()}>+</button>
      <button onClick={updateState}>set</button>
    </div>
  );
}

afterEach(cleanup);

test('should incresase/decrease state counter in hook', () => {
  const counter = new CounterContainer();
  let setState;
  testHook(() => ([, setState] = useStore(counter)));

  expect(counter.state.count).toBe(0);

  act(() => {
    setState({count: 1});
  });
  expect(counter.state.count).toBe(1);
});

test('should incresase/decrease state counter in container', () => {
  const counter = new CounterContainer();
  const {getByText} = render(<Counter store={counter} />);

  expect(counter.state.count).toBe(0);

  fireEvent.click(getByText('+'));
  expect(counter.state.count).toBe(1);

  fireEvent.click(getByText('-'));
  expect(counter.state.count).toBe(0);

  fireEvent.click(getByText('set'));
  expect(counter.state.count).toBe(100);
});

test('should work with global store from provider', () => {
  const counter = new CounterContainer();
  const {getByText} = render(
    <Provider store={counter}>
      <Counter />
    </Provider>
  );

  expect(counter.state.count).toBe(0);

  fireEvent.click(getByText('+'));
  expect(counter.state.count).toBe(1);

  fireEvent.click(getByText('-'));
  expect(counter.state.count).toBe(0);

  fireEvent.click(getByText('set'));
  expect(counter.state.count).toBe(100);
});

test('should remove subscriber listeners if component is unmounted', () => {
  const counter = new CounterContainer();
  render(<Counter store={counter} />);

  expect(counter._listeners.length).toBe(1);

  cleanup();

  expect(counter._listeners.length).toBe(0);
});

test('should throw error when no store instance is provided', () => {
  spyOn(console, 'error');
  expect(() => render(<Counter />)).toThrowError('You must provide a store instance!');
});
