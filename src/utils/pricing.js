/**
 * SkyBook Flight Reservation System
 * Pricing & Fare Calculation Utilities
 *
 * Single source of truth for all fare computations.
 * All amounts are in INR (₹).
 */

/** Tax rate applied on base fare */
const TAX_RATE = 0.12; // 12%

/** Cabin class price multipliers (applied on top of base price) */
const CLASS_MULTIPLIERS = {
  Economy: 1,
  economy: 1,
  'Premium Economy': 1.5,
  'premium economy': 1.5,
  Business: 2.5,
  business: 2.5,
  First: 4,
  first: 4,
  'First Class': 4,
  'first class': 4,
};

/**
 * Calculates the complete fare breakdown for a flight booking.
 *
 * @param {object} flight - The flight object from sampleFlights
 * @param {object} searchParams - Search parameters containing passenger counts
 *   { adults: number, children: number, infants: number, cabinClass?: string }
 * @param {object|null} coupon - Optional coupon object to apply
 * @returns {object} Complete fare breakdown
 */
export const calculateFare = (flight, searchParams, coupon = null) => {
  const adults = parseInt(searchParams.adults, 10) || 1;
  const children = parseInt(searchParams.children, 10) || 0;
  const infants = parseInt(searchParams.infants, 10) || 0;

  // Determine cabin class multiplier
  const requestedClass = searchParams.cabinClass || flight.cabinClass || 'Economy';
  const multiplier = CLASS_MULTIPLIERS[requestedClass] || 1;

  // Derive base Economy price from flight
  const flightBasePrice = flight.basePrice || flight.price;
  const flightBaseCabin = flight.baseCabinClass || (flight.basePrice ? 'Economy' : (flight.cabinClass || 'Economy'));
  const flightBaseMultiplier = CLASS_MULTIPLIERS[flightBaseCabin] || 1;
  const classRatio = multiplier / flightBaseMultiplier;

  const adultPricePerPerson = Math.round(flightBasePrice * classRatio);
  const childPricePerPerson = Math.round((flight.baseChildPrice || flight.childPrice || Math.round(flightBasePrice * 0.75)) * classRatio);
  const infantPricePerPerson = Math.round((flight.baseInfantPrice || flight.infantPrice || Math.round(flightBasePrice * 0.1)) * classRatio);

  // Totals per passenger type
  const adultTotal = adultPricePerPerson * adults;
  const childTotal = childPricePerPerson * children;
  const infantTotal = infantPricePerPerson * infants;

  // Base fare (sum of all passengers before tax)
  const baseFare = adultTotal + childTotal + infantTotal;

  // Taxes
  const taxes = Math.round(baseFare * TAX_RATE);

  // Subtotal before discount
  const subtotal = baseFare + taxes;

  // Discount calculation
  let discount = 0;
  let couponCode = null;
  let couponError = null;

  if (coupon) {
    const validation = validateCouponForFare(coupon, subtotal);
    if (validation.valid) {
      couponCode = coupon.code;
      if (coupon.discountType === 'percentage') {
        discount = Math.round((subtotal * coupon.discountValue) / 100);
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        // flat discount
        discount = coupon.discountValue;
      }
      // Discount should never exceed subtotal
      if (discount > subtotal) {
        discount = subtotal;
      }
    } else {
      couponError = validation.error;
    }
  }

  // Grand total
  const grandTotal = subtotal - discount;

  return {
    adults: {
      count: adults,
      pricePerPerson: adultPricePerPerson,
      total: adultTotal,
    },
    children: {
      count: children,
      pricePerPerson: childPricePerPerson,
      total: childTotal,
    },
    infants: {
      count: infants,
      pricePerPerson: infantPricePerPerson,
      total: infantTotal,
    },
    adultPrice: adultPricePerPerson,
    childPrice: childPricePerPerson,
    infantPrice: infantPricePerPerson,
    adultFare: adultTotal,
    childFare: childTotal,
    infantFare: infantTotal,
    cabinClass: requestedClass,
    baseFare,
    taxRate: TAX_RATE,
    taxes,
    subtotal,
    discount,
    couponCode,
    couponError,
    grandTotal,
  };
};

/**
 * Validates whether a coupon can be applied to a given fare amount.
 * @param {object} coupon
 * @param {number} amount - The subtotal to validate against
 * @returns {{ valid: boolean, error: string|null }}
 */
const validateCouponForFare = (coupon, amount) => {
  if (!coupon) {
    return { valid: false, error: 'No coupon provided.' };
  }
  if (!coupon.isActive) {
    return { valid: false, error: 'This coupon is no longer active.' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const validFrom = new Date(coupon.validFrom + 'T00:00:00');
  const validTo = new Date(coupon.validTo + 'T23:59:59');

  if (today < validFrom) {
    return { valid: false, error: 'This coupon is not yet valid.' };
  }
  if (today > validTo) {
    return { valid: false, error: 'This coupon has expired.' };
  }
  if (amount < coupon.minBookingAmount) {
    return {
      valid: false,
      error: `Minimum booking amount is ₹${coupon.minBookingAmount.toLocaleString('en-IN')}.`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Returns the cabin class multiplier for display purposes.
 * @param {string} cabinClass
 * @returns {number}
 */
export const getClassMultiplier = (cabinClass) => {
  return CLASS_MULTIPLIERS[cabinClass] || 1;
};

/**
 * Returns available cabin classes with their multipliers.
 * @returns {Array<{ name: string, multiplier: number }>}
 */
export const getCabinClasses = () => {
  return Object.entries(CLASS_MULTIPLIERS).map(([name, multiplier]) => ({
    name,
    multiplier,
  }));
};

export default {
  calculateFare,
  getClassMultiplier,
  getCabinClasses,
};
