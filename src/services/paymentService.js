/**
 * SkyBook Flight Reservation System
 * Payment Service (Simulation Only)
 *
 * WARNING: This is a demo payment service. No real payments are processed.
 * All transactions are simulated for demonstration purposes.
 */

import { getItem, setItem, generateId } from './storageService';
import { generateTransactionId } from '../utils/bookingId';

/**
 * Creates a new payment record in localStorage.
 *
 * @param {string} bookingId - The booking or draft ID this payment is for
 * @param {number} amount - Payment amount in INR
 * @param {string} method - Payment method: 'card'|'upi'|'netbanking'|'wallet'
 * @returns {object} The created payment record
 */
export const createPayment = (bookingId, amount, method) => {
  const payment = {
    id: generateId('PAY'),
    bookingId,
    amount,
    method,
    status: 'pending',
    transactionId: null,
    timestamp: new Date().toISOString(),
    completedAt: null,
  };

  const payments = getItem('payments', []);
  payments.push(payment);
  setItem('payments', payments);

  return payment;
};

/**
 * Simulates the payment outcome. In a real app, this would be handled by a
 * payment gateway callback.
 *
 * @param {string} paymentId - The payment record ID
 * @param {string} outcome - Desired outcome: 'success'|'failed'|'cancelled'
 * @returns {object} Updated payment record
 */
export const simulatePayment = (paymentId, outcome = 'success') => {
  const payments = getItem('payments', []);
  const index = payments.findIndex((p) => p.id === paymentId);

  if (index === -1) {
    return { success: false, error: 'Payment record not found.' };
  }

  const now = new Date().toISOString();

  switch (outcome) {
    case 'success':
      payments[index] = {
        ...payments[index],
        status: 'completed',
        transactionId: generateTransactionId(),
        completedAt: now,
      };
      break;

    case 'failed':
      payments[index] = {
        ...payments[index],
        status: 'failed',
        transactionId: null,
        completedAt: now,
      };
      break;

    case 'cancelled':
      payments[index] = {
        ...payments[index],
        status: 'cancelled',
        transactionId: null,
        completedAt: now,
      };
      break;

    default:
      return { success: false, error: `Unknown outcome: "${outcome}"` };
  }

  setItem('payments', payments);

  return {
    success: outcome === 'success',
    payment: payments[index],
  };
};

/**
 * Retrieves a payment record by its ID.
 * @param {string} paymentId
 * @returns {object|null}
 */
export const getPaymentById = (paymentId) => {
  if (!paymentId) return null;
  const payments = getItem('payments', []);
  return payments.find((p) => p.id === paymentId) || null;
};

/**
 * Retrieves all payments for a given booking ID.
 * @param {string} bookingId
 * @returns {Array}
 */
export const getPaymentsByBookingId = (bookingId) => {
  if (!bookingId) return [];
  const payments = getItem('payments', []);
  return payments.filter((p) => p.bookingId === bookingId);
};

/**
 * Returns all payment records (for admin/demo purposes).
 * @returns {Array}
 */
export const getAllPayments = () => {
  return getItem('payments', []);
};

/**
 * Returns a human-readable label for a payment method.
 * @param {string} method
 * @returns {string}
 */
export const getPaymentMethodLabel = (method) => {
  const labels = {
    card: 'Credit / Debit Card',
    upi: 'UPI',
    netbanking: 'Net Banking',
    wallet: 'Wallet',
  };
  return labels[method] || method;
};

/**
 * Returns a Bootstrap badge color class for a payment status.
 * @param {string} status
 * @returns {string}
 */
export const getPaymentStatusBadge = (status) => {
  const badges = {
    pending: 'bg-warning text-dark',
    completed: 'bg-success',
    failed: 'bg-danger',
    cancelled: 'bg-secondary',
    refunded: 'bg-info',
  };
  return badges[status] || 'bg-secondary';
};

export default {
  createPayment,
  simulatePayment,
  getPaymentById,
  getPaymentsByBookingId,
  getAllPayments,
  getPaymentMethodLabel,
  getPaymentStatusBadge,
};
