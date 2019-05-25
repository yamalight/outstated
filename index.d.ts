/**
 * @file
 * Outstated is built on top of React hooks, context and patterns surrounding those elements.
 *
 * It has three pieces:
 * - stores
 * - useStore
 * - `<Provider />`
 */

import { FC } from 'react';

/**
 * A hook store is a place to store state and some of the logic for updating it.
 *
 * Store is a very simple React hook (which means you can re-use it, use other
 * hooks within it, etc).
 *
 * ```tsx
 * import {useState} from 'react';
 *
 * const store = () => {
 *   const [state, setState] = useState({test: true});
 *
 *   const update = val => setState(val);
 *
 *   return {state, update};
 * };
 * ```
 *
 * Note that stores use useState hook from React for managing state.
 * When you call setState it triggers components to re-render, so be careful not
 * to mutate state directly or your components won't re-render.
 */
export declare type StoreHook<GHookReturn = any> = () => GHookReturn;

export interface ProviderProps {
  /**
   * An array of stores that will be available to retrive with useStore
   */
  stores: StoreHook[];
}

/**
 * The final piece that Outstated has is `<Provider>` component. It has two roles:
 *
 * - It initializes global instances of given stores (this is required because React
 * expects the number of hooks to be consistent across re-renders)
 * - It uses context to pass initialized instances of given stores to all the components
 * down the tree
 *
 * ```tsx
 * render(
 *   <Provider stores={[counterStore]}>
 *     <Counter />
 *   </Provider>
 * );
 * ```
 */
export declare const Provider: FC<ProviderProps>;

/**
 * Next we'll need a piece to introduce our state back into the tree so that:
 *
 * When state changes, our components re-render.
 * We can depend on our store state.
 * We can call functions exposed by the store.
 * For this we have the useStore hook which allows us to get global store instances by using specific store constructor.
 *
 * ```tsx
 * function Counter() {
 *   const {count, decrement, increment} = useStore(counterStore);
 *
 *   return (
 *     <div>
 *       <span>{count}</span>
 *       <button onClick={decrement}>-</button>
 *       <button onClick={increment}>+</button>
 *     </div>
 *   );
 * }
 * <Provider>
 * ```
 */
export declare function useStore<GHook extends StoreHook>(
  hook: GHook,
): ReturnType<GHook>;
