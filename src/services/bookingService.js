/**
 * SkyBook Flight Reservation System
 * Booking Service
 *
 * Manages the complete booking lifecycle: draft → confirm → cancel.
 * All data persisted in localStorage via storageService.
 */

import { getItem, setItem, generateId } from './storageService';
import {
  generateBookingReference,
  generateETicketNumber,
} from '../utils/bookingId';
import { calculateFare } from '../utils/pricing';

/**
 * Creates a draft booking and persists it in localStorage.
 * A draft is a booking with status 'pending' that hasn't been paid for yet.
 *
 * @param {object} flight - The selected flight object
 * @param {Array} passengers - Array of passenger objects
 * @param {object} searchParams - The original search parameters
 * @param {object|null} coupon - Optional applied coupon
 * @returns {object} The created draft booking
 */
export const createDraftBooking = (flight, passengers, searchParams, coupon = null) => {
  const draftId = generateId('DRAFT');
  const pricing = calculateFare(flight, searchParams, coupon);

  const draft = {
    id: draftId,
    bookingReference: null, // Assigned on confirmation
    eTicketNumber: null,    // Assigned on confirmation
    userId: getItem('currentUser', null)?.id || null,
    flight: { ...flight },
    passengers: [...passengers],
    searchParams: { ...searchParams },
    pricing: {
      baseFare: pricing.baseFare,
      taxes: pricing.taxes,
      discount: pricing.discount,
      couponCode: pricing.couponCode,
      total: pricing.grandTotal,
      breakdown: pricing,
    },
    status: 'pending',
    paymentStatus: 'pending',
    paymentId: null,
    bookingDate: new Date().toISOString(),
    cancellationDate: null,
    cancellable: flight.refundable,
  };

  // Store as draft
  const drafts = getItem('drafts', []);
  drafts.push(draft);
  setItem('drafts', drafts);

  return draft;
};

/**
 * Confirms a draft booking after successful payment.
 * Moves the draft to the bookings list with status 'confirmed'.
 *
 * @param {string} draftId - The draft booking ID
 * @param {string} paymentId - The payment record ID
 * @returns {object|null} The confirmed booking, or null if draft not found
 */
export const confirmBooking = (draftId, paymentId) => {
  // Prevent duplicate confirmations
  if (isDuplicateBooking(draftId)) {
    const bookings = getItem('bookings', []);
    return bookings.find((b) => b.draftId === draftId) || null;
  }

  const drafts = getItem('drafts', []);
  const draftIndex = drafts.findIndex((d) => d.id === draftId);

  if (draftIndex === -1) return null;

  const draft = drafts[draftIndex];

  const confirmedBooking = {
    ...draft,
    draftId: draft.id,
    id: generateId('BK'),
    bookingReference: generateBookingReference(),
    eTicketNumber: generateETicketNumber(),
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentId,
    bookingDate: new Date().toISOString(),
  };

  // Add to bookings
  const bookings = getItem('bookings', []);
  bookings.push(confirmedBooking);
  setItem('bookings', bookings);

  // Remove from drafts
  drafts.splice(draftIndex, 1);
  setItem('drafts', drafts);

  return confirmedBooking;
};

/**
 * Retrieves a booking by its ID.
 * @param {string} bookingId
 * @returns {object|null}
 */
export const getBookingById = (bookingId) => {
  if (!bookingId) return null;
  const bookings = getItem('bookings', []);
  return bookings.find((b) => b.id === bookingId) || null;
};

/**
 * Retrieves a booking by its booking reference (e.g. 'SKY-A3F2K9').
 * @param {string} reference
 * @returns {object|null}
 */
export const getBookingByReference = (reference) => {
  if (!reference) return null;
  const bookings = getItem('bookings', []);
  return (
    bookings.find(
      (b) => b.bookingReference && b.bookingReference.toUpperCase() === reference.toUpperCase()
    ) || null
  );
};

/**
 * Returns all bookings for a given user, sorted by most recent first.
 * @param {string} userId
 * @returns {Array}
 */
export const getUserBookings = (userId) => {
  if (!userId) return [];
  const bookings = getItem('bookings', []);
  return bookings
    .filter((b) => b.userId === userId)
    .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
};

/**
 * Cancels a booking if it's cancellable.
 * @param {string} bookingId
 * @returns {{ success: boolean, message: string, booking?: object }}
 */
export const cancelBooking = (bookingId) => {
  const bookings = getItem('bookings', []);
  const index = bookings.findIndex((b) => b.id === bookingId);

  if (index === -1) {
    return { success: false, message: 'Booking not found.' };
  }

  const booking = bookings[index];

  if (booking.status === 'cancelled') {
    return { success: false, message: 'This booking is already cancelled.' };
  }

  if (!booking.cancellable) {
    return { success: false, message: 'This booking is non-refundable and cannot be cancelled.' };
  }

  // Determine refund amount
  const cancellationFee = booking.flight?.cancellationFee || 0;
  const refundAmount = Math.max(0, booking.pricing.total - cancellationFee);

  bookings[index] = {
    ...booking,
    status: 'cancelled',
    paymentStatus: 'refunded',
    cancellationDate: new Date().toISOString(),
    refund: {
      cancellationFee,
      refundAmount,
    },
  };

  setItem('bookings', bookings);

  return {
    success: true,
    message: `Booking cancelled successfully. Refund of ₹${refundAmount.toLocaleString('en-IN')} will be processed within 5-7 business days.`,
    booking: bookings[index],
  };
};

/**
 * Updates the status of a booking.
 * @param {string} bookingId
 * @param {string} status - 'confirmed'|'cancelled'|'pending'
 * @returns {object|null} Updated booking
 */
export const updateBookingStatus = (bookingId, status) => {
  const bookings = getItem('bookings', []);
  const index = bookings.findIndex((b) => b.id === bookingId);

  if (index === -1) return null;

  bookings[index] = {
    ...bookings[index],
    status,
    ...(status === 'cancelled' ? { cancellationDate: new Date().toISOString() } : {}),
  };

  setItem('bookings', bookings);
  return bookings[index];
};

/**
 * Checks whether a draft has already been confirmed (prevents duplicate confirmations).
 * @param {string} draftId
 * @returns {boolean}
 */
export const isDuplicateBooking = (draftId) => {
  if (!draftId) return false;
  const bookings = getItem('bookings', []);
  return bookings.some((b) => b.draftId === draftId);
};

/**
 * Retrieves a draft booking by its ID.
 * @param {string} draftId
 * @returns {object|null}
 */
export const getDraftById = (draftId) => {
  if (!draftId) return null;
  const drafts = getItem('drafts', []);
  return drafts.find((d) => d.id === draftId) || null;
};

/**
 * Returns all bookings (for admin/demo purposes).
 * @returns {Array}
 */
export const getAllBookings = () => {
  return getItem('bookings', []);
};

export default {
  createDraftBooking,
  confirmBooking,
  getBookingById,
  getBookingByReference,
  getUserBookings,
  cancelBooking,
  updateBookingStatus,
  isDuplicateBooking,
  getDraftById,
  getAllBookings,
};
