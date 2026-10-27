import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BookingContext = createContext(null);

/* ── demo coupon codes ─────────────────────────────────────────────── */
const DEMO_COUPONS = {
  SKYBOOK10: { discount: 10, type: 'percent', description: '10% off', maxDiscount: 1500 },
  FIRST500:  { discount: 500, type: 'flat', description: '₹500 off' },
  FLY20:     { discount: 20, type: 'percent', description: '20% off', maxDiscount: 3000 },
  WELCOME:   { discount: 15, type: 'percent', description: '15% off on first booking', maxDiscount: 2000 },
  SUMMER25:  { discount: 25, type: 'percent', description: '25% off summer sale', maxDiscount: 4000 },
};

/* ── helper: safe JSON parse from localStorage ─────────────────────── */
function loadFromLS(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * BookingProvider — manages the entire booking flow:
 * search → select flight → passengers → fare → payment → confirm
 */
export function BookingProvider({ children }) {
  /* ── state ───────────────────────────────────────────────────────── */
  const [searchParams, setSearchParamsState] = useState(
    () => loadFromLS('skybook_search_params', null)
  );
  const [selectedFlight, setSelectedFlightState] = useState(
    () => loadFromLS('skybook_selected_flight', null)
  );
  const [passengers, setPassengersState] = useState([]);
  const [draftBooking, setDraftBookingState] = useState(
    () => loadFromLS('skybook_draft_booking', null)
  );
  const [currentBooking, setCurrentBooking] = useState(null);
  const [fareDetails, setFareDetailsState] = useState(null);
  const [couponCode, setCouponCode] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  /* ── persist critical state to localStorage ──────────────────────── */
  useEffect(() => {
    if (searchParams) {
      localStorage.setItem('skybook_search_params', JSON.stringify(searchParams));
    } else {
      localStorage.removeItem('skybook_search_params');
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedFlight) {
      localStorage.setItem('skybook_selected_flight', JSON.stringify(selectedFlight));
    } else {
      localStorage.removeItem('skybook_selected_flight');
    }
  }, [selectedFlight]);

  useEffect(() => {
    if (draftBooking) {
      localStorage.setItem('skybook_draft_booking', JSON.stringify(draftBooking));
    } else {
      localStorage.removeItem('skybook_draft_booking');
    }
  }, [draftBooking]);

  /* ── actions ─────────────────────────────────────────────────────── */

  const setSearchParams = useCallback((params) => {
    setSearchParamsState(params);
  }, []);

  const selectFlight = useCallback((flight) => {
    setSelectedFlightState(flight);
  }, []);

  const setPassengers = useCallback((list) => {
    setPassengersState(list);
  }, []);

  const setFareDetails = useCallback((fare) => {
    setFareDetailsState(fare);
  }, []);

  /** Create a draft booking from the current flow state */
  const createDraft = useCallback(() => {
    if (!selectedFlight || !searchParams) return null;

    const adults = searchParams.adults || 1;
    const children = searchParams.children || 0;
    const infants = searchParams.infants || 0;
    const totalPassengers = adults + children + infants;

    const adultFare = selectedFlight.price * adults;
    const childFare = Math.round(selectedFlight.price * 0.75) * children;
    const infantFare = Math.round(selectedFlight.price * 0.1) * infants;
    const baseFare = adultFare + childFare + infantFare;
    const taxes = Math.round(baseFare * 0.12);
    let discount = couponDiscount || 0;
    const grandTotal = baseFare + taxes - discount;

    const fare = {
      adultCount: adults,
      childCount: children,
      infantCount: infants,
      adultFare,
      childFare,
      infantFare,
      baseFare,
      taxes,
      discount,
      couponCode: couponCode || null,
      grandTotal,
    };

    setFareDetailsState(fare);

    const draft = {
      id: `BK${Date.now().toString(36).toUpperCase()}`,
      status: 'draft',
      flight: selectedFlight,
      searchParams,
      passengers: passengers.length > 0 ? passengers : [],
      fareDetails: fare,
      totalPassengers,
      createdAt: new Date().toISOString(),
    };

    setDraftBookingState(draft);
    return draft;
  }, [selectedFlight, searchParams, passengers, couponCode, couponDiscount]);

  /** Confirm booking after successful payment simulation */
  const confirmCurrentBooking = useCallback(
    (paymentId) => {
      const draft = draftBooking || {};
      const confirmed = {
        ...draft,
        status: 'confirmed',
        paymentId: paymentId || `PAY${Date.now()}`,
        confirmedAt: new Date().toISOString(),
        pnr: generatePNR(),
      };

      // Persist to bookings list
      const bookings = loadFromLS('skybook_bookings', []);
      bookings.push(confirmed);
      localStorage.setItem('skybook_bookings', JSON.stringify(bookings));

      setCurrentBooking(confirmed);
      setDraftBookingState(null);
      localStorage.removeItem('skybook_draft_booking');

      return confirmed;
    },
    [draftBooking]
  );

  /** Reset the entire booking flow */
  const clearBookingFlow = useCallback(() => {
    setSearchParamsState(null);
    setSelectedFlightState(null);
    setPassengersState([]);
    setFareDetailsState(null);
    setDraftBookingState(null);
    setCurrentBooking(null);
    setCouponCode(null);
    setCouponDiscount(0);
    localStorage.removeItem('skybook_search_params');
    localStorage.removeItem('skybook_selected_flight');
    localStorage.removeItem('skybook_draft_booking');
  }, []);

  /** Apply a coupon code */
  const applyCoupon = useCallback(
    (code) => {
      const upperCode = (code || '').toUpperCase().trim();
      const coupon = DEMO_COUPONS[upperCode];

      if (!coupon) {
        return { success: false, message: 'Invalid coupon code.' };
      }

      if (!selectedFlight) {
        return { success: false, message: 'Please select a flight first.' };
      }

      const adults = searchParams?.adults || 1;
      const children = searchParams?.children || 0;
      const infants = searchParams?.infants || 0;

      const adultFare = selectedFlight.price * adults;
      const childFare = Math.round(selectedFlight.price * 0.75) * children;
      const infantFare = Math.round(selectedFlight.price * 0.1) * infants;
      const baseFare = adultFare + childFare + infantFare;

      let discount = 0;
      if (coupon.type === 'percent') {
        discount = Math.round(baseFare * (coupon.discount / 100));
        if (coupon.maxDiscount) {
          discount = Math.min(discount, coupon.maxDiscount);
        }
      } else {
        discount = coupon.discount;
      }

      setCouponCode(upperCode);
      setCouponDiscount(discount);

      return {
        success: true,
        message: `Coupon applied! ${coupon.description} — you save ₹${discount.toLocaleString('en-IN')}`,
        discount,
      };
    },
    [selectedFlight, searchParams]
  );

  /** Remove applied coupon */
  const removeCoupon = useCallback(() => {
    setCouponCode(null);
    setCouponDiscount(0);
  }, []);

  /* ── context value ───────────────────────────────────────────────── */

  const value = {
    searchParams,
    selectedFlight,
    passengers,
    draftBooking,
    currentBooking,
    fareDetails,
    couponCode,
    couponDiscount,
    setSearchParams,
    selectFlight,
    setPassengers,
    setFareDetails,
    createDraft,
    confirmCurrentBooking,
    clearBookingFlow,
    applyCoupon,
    removeCoupon,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

/* ── helper: 6-char PNR ────────────────────────────────────────────── */
function generatePNR() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pnr = '';
  for (let i = 0; i < 6; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
}

/**
 * Custom hook to access booking context.
 */
export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return ctx;
}

export default BookingContext;
