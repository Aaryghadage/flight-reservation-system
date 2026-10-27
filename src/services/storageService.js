/**
 * SkyBook Flight Reservation System
 * Local Storage Service
 *
 * Robust wrapper around localStorage with skybook_ key prefix,
 * safe JSON handling, seeding, and reset capabilities.
 */

import { sampleFlights } from '../data/flights';
import { sampleCoupons } from '../data/coupons';

const PREFIX = 'skybook_';

/**
 * Safely parses JSON with a fallback value.
 * @param {string} jsonString
 * @param {*} fallback
 * @returns {*}
 */
const safeParse = (jsonString, fallback = null) => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
};

/**
 * Gets a value from localStorage by key (auto-prefixed).
 * @param {string} key - Key without prefix
 * @param {*} defaultValue - Returned if key doesn't exist or parse fails
 * @returns {*}
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const raw = window.localStorage.getItem(`${PREFIX}${key}`);
    if (raw === null) return defaultValue;
    return safeParse(raw, defaultValue);
  } catch (error) {
    console.warn(`storageService.getItem: Error reading "${key}"`, error);
    return defaultValue;
  }
};

/**
 * Sets a value in localStorage by key (auto-prefixed).
 * @param {string} key - Key without prefix
 * @param {*} value - Any JSON-serializable value
 * @returns {boolean} true if successful
 */
export const setItem = (key, value) => {
  try {
    window.localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`storageService.setItem: Error writing "${key}"`, error);
    return false;
  }
};

/**
 * Removes a single key from localStorage (auto-prefixed).
 * @param {string} key - Key without prefix
 */
export const removeItem = (key) => {
  try {
    window.localStorage.removeItem(`${PREFIX}${key}`);
  } catch (error) {
    console.warn(`storageService.removeItem: Error removing "${key}"`, error);
  }
};

/**
 * Clears all localStorage keys that start with the skybook_ prefix.
 */
export const clearAll = () => {
  try {
    const keysToRemove = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => window.localStorage.removeItem(key));
  } catch (error) {
    console.warn('storageService.clearAll: Error clearing storage', error);
  }
};

/**
 * Generates a unique ID with a prefix using timestamp + random string.
 * @param {string} prefix - e.g. 'BK', 'PAY'
 * @returns {string} e.g. 'BK-1698012345678'
 */
export const generateId = (prefix = 'ID') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
};

/**
 * Seeds the demo data (flights, coupons) into localStorage on first load.
 * Checks the skybook_seeded flag to avoid re-seeding.
 */
export const seedData = () => {
  try {
    const alreadySeeded = getItem('seeded', false);
    if (alreadySeeded) return;

    setItem('flights', sampleFlights);
    setItem('coupons', sampleCoupons);
    setItem('bookings', []);
    setItem('payments', []);
    // Seed a demo user account (password is btoa('Demo@1234') — demo only, NOT secure)
    const demoUser = {
      id: 'demo_user_001',
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@skybook.com',
      phone: '+91 9876543210',
      password: btoa('Demo@1234'),
      avatar: null,
      createdAt: new Date().toISOString(),
    };
    setItem('users', [demoUser]);
    if (!getItem('current_user', null)) {
      setItem('current_user', demoUser);
    }
    setItem('seeded', true);

    console.info('SkyBook: Demo data seeded successfully.');
  } catch (error) {
    console.warn('storageService.seedData: Error seeding data', error);
  }
};

/**
 * Completely clears all SkyBook data and re-seeds from scratch.
 * Useful for demo reset / troubleshooting.
 */
export const resetDemoData = () => {
  try {
    clearAll();
    // Force re-seed
    setItem('flights', sampleFlights);
    setItem('coupons', sampleCoupons);
    setItem('bookings', []);
    setItem('payments', []);
    // Seed a demo user account (password is btoa('Demo@1234') — demo only, NOT secure)
    const demoUser = {
      id: 'demo_user_001',
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@skybook.com',
      phone: '+91 9876543210',
      password: btoa('Demo@1234'),
      avatar: null,
      createdAt: new Date().toISOString(),
    };
    setItem('users', [demoUser]);
    if (!getItem('current_user', null)) {
      setItem('current_user', demoUser);
    }
    setItem('seeded', true);

    console.info('SkyBook: Demo data has been reset.');
  } catch (error) {
    console.warn('storageService.resetDemoData: Error resetting data', error);
  }
};

/**
 * Returns all stored bookings.
 * @returns {Array}
 */
export const getBookings = () => getItem('bookings', []);

/**
 * Returns all stored payments.
 * @returns {Array}
 */
export const getPayments = () => getItem('payments', []);

/**
 * Returns all stored users.
 * @returns {Array}
 */
export const getUsers = () => getItem('users', []);

export default {
  getItem,
  setItem,
  removeItem,
  clearAll,
  generateId,
  seedData,
  resetDemoData,
  getBookings,
  getPayments,
  getUsers,
};
