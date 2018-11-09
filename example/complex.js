// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import {Container, useStore} from '../src';

class AppContainer extends Container {
  state = {
    amount: 1,
  };
}

class CounterContainer extends Container {
  state = {
    count: 0,
  };

  increment = amount => {
    this.setState({count: this.state.count + amount});
  };

  decrement = amount => {
    this.setState({count: this.state.count - amount});
  };
}

const appStore = new AppContainer();
const counterStore = new CounterContainer();

function Counter() {
  const [appState] = useStore(appStore);
  const [counterState, , counter] = useStore(counterStore);

  return (
    <div>
      <span>Count: {counterState.count}</span>
      <button onClick={() => counter.decrement(appState.amount)}>-</button>
      <button onClick={() => counter.increment(appState.amount)}>+</button>
    </div>
  );
}

function App() {
  const [state, setState] = useStore(appStore);

  return (
    <div>
      <Counter />
      <label>Amount: </label>
      <input
        type="number"
        value={state.amount}
        onChange={event => {
          setState({amount: parseInt(event.target.value, 10)});
        }}
      />
    </div>
  );
}

ReactDOM.render(<App />, window.complex);
