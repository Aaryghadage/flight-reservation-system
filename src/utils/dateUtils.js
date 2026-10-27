/**
 * SkyBook Flight Reservation System
 * Date & Time Utility Functions
 */

/**
 * Formats a date string (YYYY-MM-DD or ISO) to a human-readable format.
 * e.g. '2026-10-25' → 'Sun, 25 Oct 2026'
 * @param {string} dateStr
 * @returns {string}
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

/**
 * Formats a 24h time string to 12h AM/PM format.
 * e.g. '14:30' → '2:30 PM'
 * @param {string} timeStr - HH:MM format
 * @returns {string}
 */
export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch {
    return timeStr;
  }
};

/**
 * Formats a full date-time string.
 * e.g. '2026-10-25' → 'Sun, 25 Oct 2026 at 12:00 AM'
 * @param {string} dateStr
 * @returns {string}
 */
export const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateStr;
  }
};

/**
 * Checks if a given date falls within a start and end date range (inclusive).
 * @param {string} date - YYYY-MM-DD
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate - YYYY-MM-DD
 * @returns {boolean}
 */
export const isDateInRange = (date, startDate, endDate) => {
  if (!date || !startDate || !endDate) return false;
  const d = new Date(date + 'T00:00:00');
  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T23:59:59');
  return d >= start && d <= end;
};

/**
 * Returns today's date in YYYY-MM-DD format for date picker min value.
 * @returns {string}
 */
export const getMinDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Returns a date 6 months from today in YYYY-MM-DD format for date picker max value.
 * @returns {string}
 */
export const getMaxDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 6);
  return date.toISOString().split('T')[0];
};

/**
 * Calculates age in years from a date of birth string.
 * @param {string} dob - YYYY-MM-DD
 * @returns {number}
 */
export const calculateAge = (dob) => {
  if (!dob) return 0;
  const birthDate = new Date(dob + 'T00:00:00');
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

/**
 * Validates that a date string represents a future date.
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {boolean}
 */
export const isValidFutureDate = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

/**
 * Returns the day of the week for a given date.
 * e.g. '2026-10-25' → 'Sunday'
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {string}
 */
export const getDayOfWeek = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-IN', { weekday: 'long' });
  } catch {
    return '';
  }
};

/**
 * Formats a currency value in INR.
 * @param {number} amount
 * @returns {string} e.g. '₹4,500'
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default {
  formatDate,
  formatTime,
  formatDateTime,
  isDateInRange,
  getMinDate,
  getMaxDate,
  calculateAge,
  isValidFutureDate,
  getDayOfWeek,
  formatCurrency,
};
