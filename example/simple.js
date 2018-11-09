import React from 'react';
import ReactDOM from 'react-dom';
import {Container, useStore} from '../src';

class CounterContainer extends Container {
  state = {count: 0};

  increment = () => {
    this.setState({count: this.state.count + 1});
  };

  decrement = () => {
    this.setState({count: this.state.count - 1});
  };
}

const store = new CounterContainer();

function Counter() {
  const [state, setState, counter] = useStore(store);

  const reset = () => setState({count: 0});

  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <span>{state.count}</span>
      <button onClick={counter.increment}>+</button>
      <button onClick={reset}>reset</button>
    </div>
  );
}

ReactDOM.render(<Counter />, window.simple);
