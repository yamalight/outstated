# Outstated

> Simple hooks-based state management for React

[![Build Status](https://travis-ci.com/yamalight/outstated.svg?branch=master)](https://travis-ci.com/yamalight/outstated)
[![Coverage Status](https://coveralls.io/repos/github/yamalight/outstated/badge.svg?branch=master)](https://coveralls.io/github/yamalight/outstated?branch=master)
[![Minzip Size](https://img.shields.io/bundlephobia/minzip/outstated.svg?style=flat)](https://www.npmjs.com/package/outstated)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)

Like [unstated](https://github.com/jamiebuilds/unstated) but with hooks

## Installation

```sh
npm install outstated
```

## Example

```jsx
import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {Provider, useStore} from 'outstated';

const store = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return {count, increment, decrement, reset};
};

function Counter() {
  const {count, increment, decrement, reset} = useStore(store);

  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={reset}>reset</button>
    </div>
  );
}

ReactDOM.render(
  <Provider stores={[store]}>
    <Counter />
  </Provider>,
  document.getElementById('root')
);
```

For more examples, see the `example/` directory.

## Guide

[Unstated](https://github.com/jamiebuilds/unstated) is awesome, but doesn't really use hooks.  
Can we build something similar to unstated with hooks to make something even nicer?

### Introducing Outstated

I really like unstated. I really like hooks.
I wanted a simple hook-based app state management solution.
This is why I've built Outstated.

Outstated is built on top of React hooks, context
and patterns surrounding those elements.

It has three pieces:

##### `Store`

It's a place to store our state and some of the logic for updating it.

Store is a very simple React hook (which means you can re-use it, use other hooks within it, etc).

```js
import {useState} from 'React';

const store = () => {
  const [state, setState] = useState({test: true});

  const update = val => setState(val);

  return {state, update};
};
```

Note that stores use `useState` hook from React for managing state.
When you call `setState` it triggers components to re-render,
so be careful not to mutate `state` directly or your components won't re-render.

##### `useStore`

Next we'll need a piece to introduce our state back into the tree so that:

- When state changes, our components re-render.
- We can depend on our store state.
- We can call functions exposed by the store.

For this we have the `useStore` hook which allows us to get global store instances
by using specific store constructor.

```jsx
function Counter() {
  const {count, decrement, increment} = useStore(counterStore);

  return (
    <div>
      <span>{count}</span>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

##### `<Provider>`

The final optional piece that Outstated has is `<Provider>` component.
It has two roles:

1. It initializes global instances of given stores (this is required because React expects the number of hooks to be consistent across re-renders)
2. It uses context to pass initialized instances of given stores to all the components down the tree

```jsx
render(
  <Provider stores={[counterStore]}>
    <Counter />
  </Provider>
);
```

### Testing

Whenever we consider the way that we write the state in our apps we should be
thinking about testing.  
We want to make sure that our state containers have a clean way to test them.

Because our containers are just hooks, we can construct them in
tests and assert different things about them very easily.

```js
import {act, testHook} from 'react-testing-library';

test('counter', async () => {
  let count, increment;
  testHook(() => ({count, increment, decrement} = counterStore()));

  expect(count).toBe(0);

  act(() => increment());
  expect(count).toBe(1);

  act(() => decrement());
  expect(count).toBe(0);
});
```

## Related

- [Unstated](https://github.com/jamiebuilds/unstated)
- [React hooks](https://reactjs.org/docs/hooks-intro.html)
