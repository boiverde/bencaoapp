import { useState, useCallback } from 'react';

// State manager SIMPLES sem localStorage
const globalState: { [key: string]: any } = {};

export function useGlobalState<T>(
  key: string,
  initialState: T,
  options?: { key?: string }
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    return globalState[key] ?? initialState;
  });

  const setGlobalState = useCallback((value: T | ((prev: T) => T)) => {
    const newValue = typeof value === 'function' ? (value as any)(globalState[key] ?? initialState) : value;
    globalState[key] = newValue;
    setState(newValue);
  }, [key, initialState]);

  return [state, setGlobalState];
}
