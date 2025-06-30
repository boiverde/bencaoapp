import { InteractionManager } from 'react-native';

/**
 * Utility for performance optimization
 */
export class Performance {
  /**
   * Run a task after interactions/animations have completed
   * @param task Function to run
   * @param timeout Optional timeout in ms
   * @returns Promise that resolves when the task is complete
   */
  static runAfterInteractions<T>(task: () => T | Promise<T>, timeout?: number): Promise<T> {
    return new Promise((resolve, reject) => {
      InteractionManager.runAfterInteractions(() => {
        try {
          const result = task();
          if (result instanceof Promise) {
            result.then(resolve).catch(reject);
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      }).then(() => {
        // If a timeout is provided, we'll resolve after that time
        // This is useful for ensuring the UI has time to update
        if (timeout) {
          setTimeout(() => {
            try {
              const result = task();
              if (result instanceof Promise) {
                result.then(resolve).catch(reject);
              } else {
                resolve(result);
              }
            } catch (error) {
              reject(error);
            }
          }, timeout);
        }
      });
    });
  }

  /**
   * Debounce a function to prevent rapid repeated calls
   * @param func Function to debounce
   * @param wait Wait time in ms
   * @returns Debounced function
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    
    return function(...args: Parameters<T>): void {
      const later = () => {
        timeout = null;
        func(...args);
      };
      
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle a function to limit how often it can be called
   * @param func Function to throttle
   * @param limit Limit in ms
   * @returns Throttled function
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle = false;
    let lastFunc: NodeJS.Timeout;
    let lastRan: number;
    
    return function(...args: Parameters<T>): void {
      if (!inThrottle) {
        func(...args);
        lastRan = Date.now();
        inThrottle = true;
        
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func(...args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  /**
   * Memoize a function to cache results
   * @param func Function to memoize
   * @returns Memoized function
   */
  static memoize<T extends (...args: any[]) => any>(
    func: T
  ): (...args: Parameters<T>) => ReturnType<T> {
    const cache = new Map<string, ReturnType<T>>();
    
    return function(...args: Parameters<T>): ReturnType<T> {
      const key = JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key) as ReturnType<T>;
      }
      
      const result = func(...args);
      cache.set(key, result);
      return result;
    };
  }
}