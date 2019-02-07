import React, {createContext, useContext, useEffect, useState} from 'react';

// Create context for global store assignment
const ContainerContext = createContext();

export const Provider = ({store, children}) => (
  <ContainerContext.Provider value={store}>{children}</ContainerContext.Provider>
);

export class Container {
  state = {};

  _listeners = [];

  setState = (updater, callback) => {
    let nextState;

    if (typeof updater === 'function') {
      nextState = updater(this.state);
    } else {
      nextState = updater;
    }

    if (nextState == null) {
      if (callback) callback();
      return;
    }

    this.state = Object.assign({}, this.state, nextState);

    // trigger state updates in registered hooks
    this._listeners.forEach(listener => listener(this.state));
  };

  subscribe(listener) {
    if (!this._listeners.includes(listener)) {
      this._listeners.push(listener);
    }
  }

  unsubscribe(listener) {
    this._listeners = this._listeners.filter(l => l !== listener);
  }
}

export function useStore(instance) {
  // try to get instance from context
  if (!instance) {
    instance = useContext(ContainerContext);
  }

  // if no instance is given - throw an error
  if (!instance) {
    throw new Error('You must provide a store instance!');
  }

  const [state, setState] = useState(instance.state);

  // queue subscriber cleanup on component unmount
  useEffect(() => () => instance.unsubscribe(setState), [instance]);

  // subscribe to store changes
  instance.subscribe(setState);

  return [state, instance.setState, instance];
}
