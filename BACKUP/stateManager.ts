import { useState, useEffect, useCallback } from 'react';
import { SecureStorage } from './secureStorage';

/**
 * Type for state change listeners
 */
type StateListener<T> = (newState: T) => void;

/**
 * Options for state persistence
 */
interface PersistOptions {
  key: string;
  secure?: boolean;
}

/**
 * Global state manager for the application
 */
export class StateManager {
  private static states: Map<string, any> = new Map();
  private static listeners: Map<string, Set<StateListener<any>>> = new Map();
  private static persistenceKeys: Map<string, PersistOptions> = new Map();

  /**
   * Set a global state value
   * @param key State key
   * @param value New state value
   * @param persist Optional persistence options
   */
  static setState<T>(key: string, value: T, persist?: PersistOptions): void {
    this.states.set(key, value);
    
    // Save to storage if persistence is enabled
    if (persist) {
      this.persistenceKeys.set(key, persist);
      this.persistState(key, value, persist);
    }
    
    // Notify listeners
    if (this.listeners.has(key)) {
      this.listeners.get(key)?.forEach(listener => {
        listener(value);
      });
    }
  }

  /**
   * Get a global state value
   * @param key State key
   * @returns Current state value, or undefined if not set
   */
  static getState<T>(key: string): T | undefined {
    return this.states.get(key);
  }

  /**
   * Subscribe to state changes
   * @param key State key
   * @param listener Function to call when state changes
   * @returns Unsubscribe function
   */
  static subscribe<T>(key: string, listener: StateListener<T>): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    
    this.listeners.get(key)?.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.get(key)?.delete(listener);
      if (this.listeners.get(key)?.size === 0) {
        this.listeners.delete(key);
      }
    };
  }

  /**
   * Clear a specific state
   * @param key State key
   */
  static clearState(key: string): void {
    this.states.delete(key);
    
    // Clear from storage if it was persisted
    if (this.persistenceKeys.has(key)) {
      const options = this.persistenceKeys.get(key);
      if (options?.secure) {
        SecureStorage.deleteItem(options.key);
      } else {
        localStorage.removeItem(options?.key || key);
      }
      this.persistenceKeys.delete(key);
    }
    
    // Notify listeners
    if (this.listeners.has(key)) {
      this.listeners.get(key)?.forEach(listener => {
        listener(undefined);
      });
    }
  }

  /**
   * Clear all states
   */
  static clearAllStates(): void {
    // Clear all states and notify listeners
    for (const key of this.states.keys()) {
      this.clearState(key);
    }
  }

  /**
   * Persist state to storage
   */
  private static async persistState<T>(key: string, value: T, options: PersistOptions): Promise<void> {
    try {
      const storageKey = options.key || key;
      const stringValue = JSON.stringify(value);
      
      if (options.secure) {
        await SecureStorage.saveItem(storageKey, stringValue);
      } else {
        localStorage.setItem(storageKey, stringValue);
      }
    } catch (error) {
      console.error(`Error persisting state for key ${key}:`, error);
    }
  }

  /**
   * Load persisted state from storage
   */
  static async loadPersistedState(key: string, options: PersistOptions): Promise<any> {
    try {
      const storageKey = options.key || key;
      let stringValue: string | null = null;
      
      if (options.secure) {
        stringValue = await SecureStorage.getItem(storageKey);
      } else {
        stringValue = localStorage.getItem(storageKey);
      }
      
      if (stringValue) {
        const value = JSON.parse(stringValue);
        this.states.set(key, value);
        return value;
      }
    } catch (error) {
      console.error(`Error loading persisted state for key ${key}:`, error);
    }
    
    return undefined;
  }
}

/**
 * Hook for using global state in components
 * @param key State key
 * @param initialValue Optional initial value
 * @param persistOptions Optional persistence options
 * @returns [state, setState] tuple
 */
export function useGlobalState<T>(
  key: string, 
  initialValue?: T,
  persistOptions?: PersistOptions
): [T, (value: T) => void] {
  // Initialize local state with the global state or initial value
  const [state, setLocalState] = useState<T>(() => {
    const currentValue = StateManager.getState<T>(key);
    return currentValue !== undefined ? currentValue : (initialValue as T);
  });

  // Load persisted state on mount
  useEffect(() => {
    if (persistOptions) {
      StateManager.loadPersistedState(key, persistOptions)
        .then(loadedValue => {
          if (loadedValue !== undefined) {
            setLocalState(loadedValue);
          } else if (initialValue !== undefined) {
            // If no persisted value but we have an initial value, set it
            StateManager.setState(key, initialValue, persistOptions);
          }
        });
    } else if (initialValue !== undefined && StateManager.getState(key) === undefined) {
      // If no persisted options but we have an initial value and no current state, set it
      StateManager.setState(key, initialValue);
    }
  }, [key]);

  // Subscribe to state changes
  useEffect(() => {
    const unsubscribe = StateManager.subscribe<T>(key, newValue => {
      setLocalState(newValue);
    });
    
    return unsubscribe;
  }, [key]);

  // Function to update the state
  const setState = useCallback((value: T) => {
    StateManager.setState(key, value, persistOptions);
  }, [key, persistOptions]);

  return [state, setState];
}