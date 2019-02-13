// @flow
import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {Provider, useStore} from '../src';

const appStore = () => {
  const [amount, setAmount] = useState(1);

  return {amount, setAmount};
};

const counterStore = () => {
  const [count, setCount] = useState(0);

  const increment = amount => setCount(count + amount);
  const decrement = amount => setCount(count - amount);
  const reset = () => setCount(0);

  return {count, increment, decrement, reset};
};

function Counter() {
  const {amount} = useStore(appStore);
  const {count, increment, decrement} = useStore(counterStore);

  return (
    <div>
      <span>Count: {count}</span>
      <button onClick={() => decrement(amount)}>-</button>
      <button onClick={() => increment(amount)}>+</button>
    </div>
  );
}

function App() {
  const {amount, setAmount} = useStore(appStore);

  return (
    <div>
      <Counter />
      <label>Amount: </label>
      <input
        type="number"
        value={amount}
        onChange={event => {
          setAmount(parseInt(event.target.value, 10));
        }}
      />
    </div>
  );
}

ReactDOM.render(
  <Provider stores={[appStore, counterStore]}>
    <App />
  </Provider>,
  window.complex
);
