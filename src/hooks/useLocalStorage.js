/**
 * SkyBook Flight Reservation System
 * Custom Hook: useLocalStorage
 *
 * Syncs React state with localStorage, using the skybook_ prefix.
 */

import { useState, useCallback } from 'react';

const PREFIX = 'skybook_';

/**
 * Custom hook for reading/writing values to localStorage with React state sync.
 *
 * @param {string} key - The storage key (will be prefixed with "skybook_")
 * @param {*} initialValue - Default value if nothing is stored
 * @returns {[*, Function, Function]} [storedValue, setValue, removeValue]
 */
const useLocalStorage = (key, initialValue) => {
  const prefixedKey = `${PREFIX}${key}`;

  // Lazy initializer: read from localStorage once on mount
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(prefixedKey);
      if (item !== null) {
        return JSON.parse(item);
      }
      // If no stored value, persist the initial value
      if (initialValue !== undefined) {
        window.localStorage.setItem(prefixedKey, JSON.stringify(initialValue));
      }
      return initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: Error reading key "${prefixedKey}"`, error);
      return initialValue;
    }
  });

  /**
   * Sets a new value in both React state and localStorage.
   * Accepts a value or a function (like setState).
   */
  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(prefixedKey, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`useLocalStorage: Error setting key "${prefixedKey}"`, error);
      }
    },
    [prefixedKey, storedValue]
  );

  /**
   * Removes the key from both React state (resets to initialValue) and localStorage.
   */
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(prefixedKey);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`useLocalStorage: Error removing key "${prefixedKey}"`, error);
    }
  }, [prefixedKey, initialValue]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
