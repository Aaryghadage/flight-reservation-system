/**
 * SkyBook Flight Reservation System
 * Unique ID Generation Utilities
 */

/**
 * Generates a unique ID with a given prefix, using timestamp + random chars.
 * @param {string} prefix - e.g. 'BK', 'PAY'
 * @returns {string} e.g. 'BK-1698012345678-a3f2'
 */
export const generateUniqueId = (prefix = 'ID') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 6);
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Generates a booking reference like 'SKY-A3F2K9'.
 * 6 alphanumeric uppercase characters.
 * @returns {string}
 */
export const generateBookingReference = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SKY-${result}`;
};

/**
 * Generates an e-ticket number like 'ET-849302716534'.
 * 12-digit numeric string.
 * @returns {string}
 */
export const generateETicketNumber = () => {
  let digits = '';
  for (let i = 0; i < 12; i++) {
    digits += Math.floor(Math.random() * 10).toString();
  }
  return `ET-${digits}`;
};

/**
 * Generates a transaction ID like 'TXN-1698012345678-x7k2'.
 * @returns {string}
 */
export const generateTransactionId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 6);
  return `TXN-${timestamp}-${random}`;
};

export default {
  generateUniqueId,
  generateBookingReference,
  generateETicketNumber,
  generateTransactionId,
};
