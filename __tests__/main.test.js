/* eslint-env jest */
import React from 'react';
import renderer from 'react-test-renderer';
import {Container, Provider, useStore} from '../src';

const render = element => renderer.create(element).toJSON();

const click = ({children = []}, id) => {
  const el = children.find(({props = {}}) => props.id === id);
  el.props.onClick();
};

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
      <button id="decrement" onClick={counter.decrement}>
        -
      </button>
      <button id="increment" onClick={counter.increment}>
        +
      </button>
      <button id="set" onClick={updateState}>
        set to 100
      </button>
    </div>
  );
}

test('should incresase/decrease state counter in container', () => {
  const counter = new CounterContainer();
  const tree = render(<Counter store={counter} />);

  expect(counter.state.count).toBe(0);

  click(tree, 'increment');
  expect(counter.state.count).toBe(1);

  click(tree, 'decrement');
  expect(counter.state.count).toBe(0);

  click(tree, 'set');
  expect(counter.state.count).toBe(100);
});

test('should work with global store from provider', () => {
  const counter = new CounterContainer();
  const tree = render(
    <Provider store={counter}>
      <Counter />
    </Provider>
  );

  expect(counter.state.count).toBe(0);

  click(tree, 'increment');
  expect(counter.state.count).toBe(1);

  click(tree, 'decrement');
  expect(counter.state.count).toBe(0);

  click(tree, 'set');
  expect(counter.state.count).toBe(100);
});

test('should remove subscriber listeners if component is unmounted', () => {
  const counter = new CounterContainer();
  const tree = renderer.create(<Counter store={counter} />);

  expect(counter._listeners.length).toBe(1);

  tree.unmount();

  expect(counter._listeners.length).toBe(0);
});

test('should throw error when no store instance is provided', () => {
  spyOn(console, 'error');
  expect(() => render(<Counter />)).toThrowError('You must provide a store instance!');
});
