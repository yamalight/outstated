/* eslint-env jest */
/* global spyOn */
import React, {useState} from 'react';
import {act, cleanup, fireEvent, render, testHook} from 'react-testing-library';
import {Provider, useStore} from '../src';

const counterStore = () => {
  const [count, setCount] = useState(0);

  const increment = (amount = 1) => setCount(count + amount);
  const decrement = (amount = 1) => setCount(count - amount);

  return {count, setCount, increment, decrement};
};

const Counter = () => {
  const {count, setCount, increment, decrement} = useStore(counterStore);

  const updateState = () => setCount(100);

  return (
    <div>
      <span>Count: {count}</span>
      <button onClick={() => decrement()}>-</button>
      <button onClick={() => increment()}>+</button>
      <button onClick={updateState}>set</button>
    </div>
  );
};

const brokenStore = () => {};

const BrokenCounter = () => {
  const {state} = useStore(brokenStore);
  return <div>{state}</div>;
};

afterEach(cleanup);

test('should incresase/decrease state counter in hook', () => {
  let count, setCount;
  testHook(() => ({count, setCount} = counterStore()));

  expect(count).toBe(0);

  act(() => {
    setCount(1);
  });
  expect(count).toBe(1);
});

test('should incresase/decrease state counter in container', () => {
  const {getByText} = render(
    <Provider stores={[counterStore]}>
      <Counter />
    </Provider>
  );

  expect(getByText(/^Count:/).textContent).toBe('Count: 0');

  fireEvent.click(getByText('+'));
  fireEvent.click(getByText('+'));
  expect(getByText(/^Count:/).textContent).toBe('Count: 2');

  fireEvent.click(getByText('-'));
  expect(getByText(/^Count:/).textContent).toBe('Count: 1');

  fireEvent.click(getByText('set'));
  expect(getByText(/^Count:/).textContent).toBe('Count: 100');
});

test('should throw error when no provider is given', () => {
  spyOn(console, 'error');
  expect(() => render(<Counter />)).toThrowError('You must wrap your components with a <Provider>!');
});

test('should throw error when no stores are given to provider', () => {
  spyOn(console, 'error');
  expect(() =>
    render(
      <Provider>
        <Counter />
      </Provider>
    )
  ).toThrowError('You must provide stores list to a <Provider> for initialization!');
});

test('should throw error when store init fails', () => {
  spyOn(console, 'error');
  expect(() =>
    render(
      <Provider stores={[brokenStore]}>
        <BrokenCounter />
      </Provider>
    )
  ).toThrowError('Provided store instance did not initialized correctly!');
});
