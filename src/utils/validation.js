/**
 * SkyBook Flight Reservation System
 * Validation Utility Functions
 */

import { sampleCoupons } from '../data/coupons';

/**
 * Validates an email address.
 * @param {string} email
 * @returns {{ valid: boolean, error: string }}
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { valid: false, error: 'Email is required.' };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }
  return { valid: true, error: '' };
};

/**
 * Validates a phone number (Indian format – 10 digits, optionally prefixed by +91).
 * @param {string} phone
 * @returns {{ valid: boolean, error: string }}
 */
export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) {
    return { valid: false, error: 'Phone number is required.' };
  }
  const cleaned = phone.trim().replace(/[\s\-()]/g, '');
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  if (!phoneRegex.test(cleaned)) {
    return { valid: false, error: 'Please enter a valid 10-digit Indian phone number.' };
  }
  return { valid: true, error: '' };
};

/**
 * Validates a password.
 * Requirements: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number.
 * @param {string} password
 * @returns {{ valid: boolean, error: string }}
 */
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, error: 'Password is required.' };
  }
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number.' };
  }
  return { valid: true, error: '' };
};

/**
 * Validates a name field (min 2 chars, letters and spaces only).
 * @param {string} name
 * @returns {{ valid: boolean, error: string }}
 */
export const validateName = (name) => {
  if (!name || !name.trim()) {
    return { valid: false, error: 'Name is required.' };
  }
  if (name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters.' };
  }
  const nameRegex = /^[a-zA-Z\s.''-]+$/;
  if (!nameRegex.test(name.trim())) {
    return { valid: false, error: 'Name can only contain letters, spaces, dots, apostrophes, and hyphens.' };
  }
  return { valid: true, error: '' };
};

/**
 * Validates all fields of a single passenger object.
 * @param {object} passenger
 *   { firstName, lastName, email, phone, dateOfBirth, gender, type }
 * @returns {{ valid: boolean, errors: object }}
 */
export const validatePassenger = (passenger) => {
  const errors = {};

  const firstNameResult = validateName(passenger.firstName);
  if (!firstNameResult.valid) errors.firstName = firstNameResult.error;

  const lastNameResult = validateName(passenger.lastName);
  if (!lastNameResult.valid) errors.lastName = lastNameResult.error;

  if (passenger.type !== 'infant') {
    const emailResult = validateEmail(passenger.email);
    if (!emailResult.valid) errors.email = emailResult.error;

    const phoneResult = validatePhone(passenger.phone);
    if (!phoneResult.valid) errors.phone = phoneResult.error;
  }

  if (!passenger.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required.';
  } else {
    const dob = new Date(passenger.dateOfBirth + 'T00:00:00');
    const today = new Date();
    if (dob >= today) {
      errors.dateOfBirth = 'Date of birth must be in the past.';
    }

    // Age validation based on passenger type
    if (passenger.type === 'adult') {
      const age = calculateAgeFromDob(passenger.dateOfBirth);
      if (age < 12) {
        errors.dateOfBirth = 'Adult passengers must be 12 years or older.';
      }
    } else if (passenger.type === 'child') {
      const age = calculateAgeFromDob(passenger.dateOfBirth);
      if (age < 2 || age > 11) {
        errors.dateOfBirth = 'Child passengers must be between 2 and 11 years old.';
      }
    } else if (passenger.type === 'infant') {
      const age = calculateAgeFromDob(passenger.dateOfBirth);
      if (age >= 2) {
        errors.dateOfBirth = 'Infant passengers must be under 2 years old.';
      }
    }
  }

  if (!passenger.gender) {
    errors.gender = 'Gender is required.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates the flight search form parameters.
 * @param {object} searchParams
 *   { origin, destination, departureDate, adults, children, infants, cabinClass }
 * @returns {{ valid: boolean, errors: object }}
 */
export const validateSearchForm = (searchParams) => {
  const errors = {};

  if (!searchParams.origin || !searchParams.origin.trim()) {
    errors.origin = 'Please select a departure city.';
  }
  if (!searchParams.destination || !searchParams.destination.trim()) {
    errors.destination = 'Please select an arrival city.';
  }
  if (
    searchParams.origin &&
    searchParams.destination &&
    searchParams.origin.trim().toUpperCase() === searchParams.destination.trim().toUpperCase()
  ) {
    errors.destination = 'Departure and arrival cities cannot be the same.';
  }
  if (!searchParams.departureDate) {
    errors.departureDate = 'Please select a departure date.';
  } else {
    const depDate = new Date(searchParams.departureDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (depDate < today) {
      errors.departureDate = 'Departure date cannot be in the past.';
    }
  }

  const adults = parseInt(searchParams.adults, 10) || 0;
  const children = parseInt(searchParams.children, 10) || 0;
  const infants = parseInt(searchParams.infants, 10) || 0;
  const totalPassengers = adults + children + infants;

  if (adults < 1) {
    errors.adults = 'At least one adult is required.';
  }
  if (totalPassengers > 9) {
    errors.adults = 'Maximum 9 passengers allowed per booking.';
  }
  if (infants > adults) {
    errors.infants = 'Number of infants cannot exceed number of adults.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates payment form data.
 * @param {object} paymentData
 *   { method, cardNumber?, cardHolder?, expiry?, cvv?, upiId? }
 * @returns {{ valid: boolean, errors: object }}
 */
export const validatePaymentForm = (paymentData) => {
  const errors = {};

  if (!paymentData.method) {
    errors.method = 'Please select a payment method.';
    return { valid: false, errors };
  }

  if (paymentData.method === 'card') {
    if (!paymentData.cardNumber || !paymentData.cardNumber.trim()) {
      errors.cardNumber = 'Card number is required.';
    } else {
      const cleaned = paymentData.cardNumber.replace(/\s/g, '');
      if (!/^\d{13,19}$/.test(cleaned)) {
        errors.cardNumber = 'Please enter a valid card number (13-19 digits).';
      }
    }
    if (!paymentData.cardHolder || !paymentData.cardHolder.trim()) {
      errors.cardHolder = 'Cardholder name is required.';
    }
    if (!paymentData.expiry || !paymentData.expiry.trim()) {
      errors.expiry = 'Expiry date is required.';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentData.expiry.trim())) {
      errors.expiry = 'Expiry must be in MM/YY format.';
    } else {
      const [month, year] = paymentData.expiry.split('/');
      const expiryDate = new Date(2000 + parseInt(year, 10), parseInt(month, 10), 0);
      if (expiryDate < new Date()) {
        errors.expiry = 'Card has expired.';
      }
    }
    if (!paymentData.cvv || !paymentData.cvv.trim()) {
      errors.cvv = 'CVV is required.';
    } else if (!/^\d{3,4}$/.test(paymentData.cvv.trim())) {
      errors.cvv = 'CVV must be 3 or 4 digits.';
    }
  }

  if (paymentData.method === 'upi') {
    if (!paymentData.upiId || !paymentData.upiId.trim()) {
      errors.upiId = 'UPI ID is required.';
    } else if (!/^[\w.\-]+@[\w]+$/.test(paymentData.upiId.trim())) {
      errors.upiId = 'Please enter a valid UPI ID (e.g., name@upi).';
    }
  }

  if (paymentData.method === 'netbanking') {
    if (!paymentData.bank || !paymentData.bank.trim()) {
      errors.bank = 'Please select a bank.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates a coupon code against the coupon dataset and booking amount.
 * @param {string} couponCode - The coupon code entered by the user
 * @param {number} bookingAmount - Current booking subtotal
 * @param {string[]} appliedCoupons - List of previously applied coupon codes (for usage checks)
 * @returns {{ valid: boolean, coupon: object|null, error: string }}
 */
export const validateCoupon = (couponCode, bookingAmount, appliedCoupons = []) => {
  if (!couponCode || !couponCode.trim()) {
    return { valid: false, coupon: null, error: 'Please enter a coupon code.' };
  }

  const code = couponCode.trim().toUpperCase();
  const coupon = sampleCoupons.find((c) => c.code.toUpperCase() === code);

  if (!coupon) {
    return { valid: false, coupon: null, error: 'Invalid coupon code. Please check and try again.' };
  }

  if (!coupon.isActive) {
    return { valid: false, coupon: null, error: 'This coupon is no longer active.' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const validFrom = new Date(coupon.validFrom + 'T00:00:00');
  const validTo = new Date(coupon.validTo + 'T23:59:59');

  if (today < validFrom) {
    return { valid: false, coupon: null, error: 'This coupon is not yet valid.' };
  }
  if (today > validTo) {
    return { valid: false, coupon: null, error: 'This coupon has expired.' };
  }

  if (bookingAmount < coupon.minBookingAmount) {
    return {
      valid: false,
      coupon: null,
      error: `Minimum booking amount of ₹${coupon.minBookingAmount.toLocaleString('en-IN')} required for this coupon.`,
    };
  }

  // Check if already used (for demo, check against appliedCoupons array)
  const usageCount = appliedCoupons.filter((c) => c.toUpperCase() === code).length;
  if (usageCount >= coupon.usageLimit) {
    return {
      valid: false,
      coupon: null,
      error: 'You have already used this coupon the maximum number of times.',
    };
  }

  return { valid: true, coupon, error: '' };
};

/**
 * Helper: Calculate age from DOB string.
 * @param {string} dob - YYYY-MM-DD
 * @returns {number}
 */
const calculateAgeFromDob = (dob) => {
  const birthDate = new Date(dob + 'T00:00:00');
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default {
  validateEmail,
  validatePhone,
  validatePassword,
  validateName,
  validatePassenger,
  validateSearchForm,
  validatePaymentForm,
  validateCoupon,
};
