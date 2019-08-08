/* eslint-env jest */
/* global spyOn */
import React, { useState } from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import { renderHook, act } from 'react-hooks-testing-library';
import { Provider, useStore } from '../src';

const oddsStore = () => {
  const [count, setCount] = useState(1);

  const increment = (amount = 2) => setCount(count + amount);
  const decrement = (amount = 2) => setCount(count - amount);

  return { count, setCount, increment, decrement };
};

const evensStore = () => {
  const [count, setCount] = useState(0);

  const increment = (amount = 2) => setCount(count + amount);
  const decrement = (amount = 2) => setCount(count - amount);

  return { count, setCount, increment, decrement };
}

const OddCounter = () => {
  const { count, setCount, increment, decrement } = useStore(oddsStore);

  const updateState = () => setCount(101);

  console.log('Render');

  return (
    <div>
      <span>Count Odd: <span data-testid='oddResult'>{count}</span></span>
      <button data-testid='odd-' onClick={() => decrement()}>-</button>
      <button data-testid='odd+' onClick={() => increment()}>+</button>
      <button data-testid='oddSet' onClick={updateState}>set</button>
    </div>
  );
};

const EvenCounter = () => {
  const { count, setCount, increment, decrement } = useStore(evensStore);

  const updateState = () => setCount(100);

  console.log('Render');

  return (
    <div>
      <span>Count Even: <span data-testid='evenResult'>{count}</span></span>
      <button data-testid='even-' onClick={() => decrement()}>Even -</button>
      <button data-testid='even+' onClick={() => increment()}>Even +</button>
      <button data-testid='evenSet' onClick={updateState}>set</button>
    </div>
  );
};

const Counter = () => (
  <>
    <OddCounter />
    <EvenCounter />
  </>
)

const brokenStore = () => { };

const BrokenCounter = () => {
  const { state } = useStore(brokenStore);
  return <div>{state}</div>;
};

afterEach(cleanup);

test('should increase/decrease state counter in hook', () => {
  let count, setCount;
  renderHook(() => ({ count, setCount } = oddsStore()));

  expect(count).toBe(1);

  act(() => {
    setCount(1);
  });
  expect(count).toBe(1);
});

test('should increase/decrease state counter in hook', () => {
  let count, setCount;
  renderHook(() => ({ count, setCount } = evensStore()));

  expect(count).toBe(0);

  act(() => {
    setCount(2);
  });
  expect(count).toBe(2);
});

test('should increase/decrease state counter in container', () => {
  const { getByTestId } = render(
    <Provider stores={[oddsStore, evensStore]}>
      <Counter />
    </Provider>
  );

  spyOn(console, 'log');

  expect(getByTestId('oddResult').textContent).toBe('1');
  expect(getByTestId('evenResult').textContent).toBe('0');

  fireEvent.click(getByTestId('odd+'));
  fireEvent.click(getByTestId('odd+'));
  expect(getByTestId('oddResult').textContent).toBe('5');

  fireEvent.click(getByTestId('even+'));
  fireEvent.click(getByTestId('even+'));
  expect(getByTestId('evenResult').textContent).toBe('4');

  fireEvent.click(getByTestId('odd-'));
  fireEvent.click(getByTestId('odd-'));
  expect(getByTestId('oddResult').textContent).toBe('1');

  fireEvent.click(getByTestId('even-'));
  fireEvent.click(getByTestId('even-'));
  expect(getByTestId('evenResult').textContent).toBe('0');

  fireEvent.click(getByTestId('oddSet'));
  expect(getByTestId('oddResult').textContent).toBe('101');

  fireEvent.click(getByTestId('evenSet'));
  expect(getByTestId('evenResult').textContent).toBe('100');

  expect(console.log).toHaveBeenCalledTimes(10);
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
