import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {Provider, useStore} from '../src';

// custom mouse position hook
const useMousePosition = () => {
  let [position, setPosition] = useState({x: null, y: null});

  const handleMouseMove = e => setPosition({x: e.pageX, y: e.pageY});

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
};

// our store
const store = () => {
  const [state, setState] = useState('hello hooks!');
  const mousePosition = useMousePosition();

  return {state, setState, mousePosition};
};

function Counter() {
  const {state, setState, mousePosition} = useStore(store);

  return (
    <div>
      <input type="text" value={state} onChange={e => setState(e.target.value)} />
      <div>
        Mouse x: {mousePosition.x}, y: {mousePosition.y}
      </div>
    </div>
  );
}

ReactDOM.render(
  <Provider stores={[store]}>
    <Counter />
  </Provider>,
  window.withhooks
);
