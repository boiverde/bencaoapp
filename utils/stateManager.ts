
import { useState, useEffect, useCallback } from 'react';

// A store to hold the state and listeners
const stores: { [key: string]: any } = {};

interface Store<T> {
  state: T;
  listeners: Set<(state: T) => void>;
  setState: (value: T | ((prev: T) => T)) => void;
}

// Function to get or create a store for a given key
function getStore<T>(key: string, initialState: T): Store<T> {
  if (!stores[key]) {
    stores[key] = {
      state: initialState,
      listeners: new Set(),
      setState(value: T | ((prev: T) => T)) {
        const newState = typeof value === 'function'
          ? (value as (prev: T) => T)(this.state)
          : value;
        
        if (this.state !== newState) {
            this.state = newState;
            // Notify all listeners about the state change
            this.listeners.forEach(listener => listener(this.state));
        }
      },
    };
  }
  return stores[key];
}

/**
 * A custom hook for a simple global state management.
 * It allows sharing state between different components without prop drilling.
 * @param key A unique key to identify the global state.
 * @param initialState The initial value of the state if it hasn't been set yet.
 * @returns A tuple with the current state and a function to update it.
 */
export function useGlobalState<T>(
  key: string,
  initialState: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const store = getStore(key, initialState);

  // Use React's local state to trigger re-renders in the component
  const [localState, setLocalState] = useState<T>(store.state);

  useEffect(() => {
    // Add the component's state updater to the set of listeners
    const listener = (newState: T) => {
      setLocalState(newState);
    };

    store.listeners.add(listener);

    // When the component unmounts, remove the listener to prevent memory leaks
    return () => {
      store.listeners.delete(listener);
    };
  }, [store]); // Dependency array ensures this runs only once per component instance

  // The setter function that updates the global state
  const setGlobalState = useCallback((value: T | ((prev: T) => T)) => {
    store.setState(value);
  }, [store]);

  return [localState, setGlobalState];
}
