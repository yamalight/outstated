# Outstated

> Simple hooks-based state management for React

[![Build Status](https://travis-ci.org/yamalight/outstated.svg?branch=master)](https://travis-ci.org/yamalight/outstated)
[![Coverage Status](https://coveralls.io/repos/github/yamalight/outstated/badge.svg?branch=master)](https://coveralls.io/github/yamalight/outstated?branch=master)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)

Like [unstated](https://github.com/jamiebuilds/unstated) but with hooks

## Installation

```sh
npm install outstated
```

## Example

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {Container, useStore} from 'outstated';

class CounterContainer extends Container {
  state = {
    count: 0,
  };

  increment = () => {
    this.setState({count: this.state.count + 1});
  };

  decrement = () => {
    this.setState({count: this.state.count - 1});
  };
}
const counter = new CounterContainer();

function Counter() {
  const [state, setState] = useStore(counter);

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

ReactDOM.render(<Counter />, document.getElementById('root'));
```

For more examples, see the `example/` directory.

## Guide

[Unstated](https://github.com/jamiebuilds/unstated) is awesome, but doesn't really use hooks.  
Can we build something similar to unstated with hooks to make something even nicer?

### Introducing Outstated

I really like unstated. I really like hooks.
I wanted a simple hook-based app state management solution.
This is why I've built Outstated.

Outstated is built on top of React components, context and hooks
and patterns surrounding those elements.

It has three pieces:

##### `Container`

It's a place to store our state and some of the logic for updating it.

`Container` is a very simple class which is meant to look just like
`React.Component` but with only the state-related bits: `this.state` and
`this.setState`.

```js
class CounterContainer extends Container {
  state = {count: 0};
  increment = () => {
    this.setState({count: this.state.count + 1});
  };
  decrement = () => {
    this.setState({count: this.state.count - 1});
  };
}
```

Note that `Container`s are also event emitters that components subscribe to for updates.
When you call `setState` it triggers components to re-render,
so be careful not to mutate `this.state` directly or your components won't re-render.

###### `setState()`

`setState()` in `Container` mimics React's `setState()` method as closely as
possible.

```js
class CounterContainer extends Container {
  state = {count: 0};
  increment = () => {
    this.setState(
      state => {
        return {count: state.count + 1};
      },
      () => {
        console.log('Updated!');
      }
    );
  };
}
```

##### `useStore`

Next we'll need a piece to introduce our state back into the tree so that:

- When state changes, our components re-render.
- We can depend on our container's state.
- We can call methods on our container.

For this we have the `useStore` hook which allows us to pass our
container instances and receive references to state, update function and
the store itself (useful when passing the store using `Provider`).

```jsx
function Counter() {
  const [state, setState, store] = useStore(counterStore);

  return (
    <div>
      <span>{state.count}</span>
      <button onClick={counterStore.decrement}>-</button>
      <button onClick={counterStore.increment}>+</button>
    </div>
  );
}
```

`useStore` will automatically construct our container and listen for changes.

##### `<Provider>`

The final optional piece that Outstated has is `<Provider>` component.
It uses context to pass a given store instance to all the components down the tree.

```jsx
render(
  <Provider store={counterStore}>
    <Counter />
  </Provider>
);
```

Once you'd wrapped your components with `<Provider>` you can simply use `useStore` hook without any arguments:

```jsx
function Counter() {
  const [state, setState, store] = useStore();

  return <div>{state.count}</div>;
}
```

### Testing

Whenever we consider the way that we write the state in our apps we should be
thinking about testing.

We want to make sure that our state containers have a clean way

Well because our containers are very simple classes, we can construct them in
tests and assert different things about them very easily.

```js
test('counter', async () => {
  let counter = new CounterContainer();
  assert(counter.state.count === 0);

  counter.increment();
  assert(counter.state.count === 1);

  counter.decrement();
  assert(counter.state.count === 0);
});
```

## Related

- [Unstated](https://github.com/jamiebuilds/unstated)
- [React hooks](https://reactjs.org/docs/hooks-intro.html)
