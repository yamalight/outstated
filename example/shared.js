// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, Container, useStore} from '../src';

class CounterContainer extends Container {
  state = {count: 0};

  increment = () => {
    this.setState({count: this.state.count + 1});
  };

  decrement = () => {
    this.setState({count: this.state.count - 1});
  };
}

const sharedCounterContainer = new CounterContainer();

function Counter() {
  const [state, setState, store] = useStore();

  const reset = () => setState({count: 0});

  return (
    <div>
      <button onClick={store.decrement}>-</button>
      <span>{state.count}</span>
      <button onClick={store.increment}>+</button>
      <button onClick={reset}>reset</button>
    </div>
  );
}

ReactDOM.render(
  <Provider store={sharedCounterContainer}>
    <Counter />
  </Provider>,
  window.shared
);
