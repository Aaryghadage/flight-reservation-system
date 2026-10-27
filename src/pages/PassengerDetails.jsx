import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PassengerForm from '../components/PassengerForm';
import BookingSummary from '../components/BookingSummary';
import { calculateFare } from '../utils/pricing';

export default function PassengerDetails() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const {
    searchParams, selectedFlight, setPassengers, setFareDetails,
    createDraft, couponCode, couponDiscount, applyCoupon, removeCoupon,
    setSearchParams,
  } = useBooking();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState({ text: '', type: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Redirect if no flight selected, or initialize default searchParams if missing
  useEffect(() => {
    if (!selectedFlight) {
      navigate('/flights');
      return;
    }
    if (!searchParams) {
      setSearchParams({
        tripType: 'one-way',
        origin: selectedFlight.origin?.code || 'BOM',
        destination: selectedFlight.destination?.code || 'DEL',
        departureDate: new Date().toISOString().split('T')[0],
        departDate: new Date().toISOString().split('T')[0],
        adults: 1,
        children: 0,
        infants: 0,
        cabinClass: selectedFlight.cabinClass || 'Economy',
      });
    }
  }, [selectedFlight, searchParams, navigate, setSearchParams]);

  // Build initial passenger slots
  const passengerSlots = useMemo(() => {
    if (!searchParams) return [];
    const slots = [];
    for (let i = 0; i < (searchParams.adults || 1); i++) {
      slots.push({ type: 'Adult', index: i });
    }
    for (let i = 0; i < (searchParams.children || 0); i++) {
      slots.push({ type: 'Child', index: slots.length });
    }
    for (let i = 0; i < (searchParams.infants || 0); i++) {
      slots.push({ type: 'Infant', index: slots.length });
    }
    return slots;
  }, [searchParams]);

  const [passengerData, setPassengerData] = useState(() =>
    passengerSlots.map((slot, idx) => ({
      title: '', firstName: '', lastName: '', dob: '', dateOfBirth: '', gender: '',
      email: idx === 0 ? (currentUser?.email || '') : '',
      phone: idx === 0 ? (currentUser?.phone || '') : '',
      nationality: 'Indian', passportNumber: '',
      type: slot.type,
    }))
  );

  // Keep passengerData synchronized with passengerSlots when searchParams updates
  useEffect(() => {
    if (passengerSlots.length > 0 && passengerData.length !== passengerSlots.length) {
      setPassengerData((prev) => {
        return passengerSlots.map((slot, idx) => {
          if (prev[idx]) return { ...prev[idx], type: slot.type };
          return {
            title: '',
            firstName: '',
            lastName: '',
            dob: '',
            dateOfBirth: '',
            gender: '',
            email: idx === 0 ? (currentUser?.email || '') : '',
            phone: idx === 0 ? (currentUser?.phone || '') : '',
            nationality: 'Indian',
            passportNumber: '',
            type: slot.type,
          };
        });
      });
    }
  }, [passengerSlots, currentUser]);

  // Recalculate fare
  const fare = useMemo(() => {
    if (!selectedFlight || !searchParams) return null;
    const f = calculateFare(selectedFlight, searchParams);
    if (couponDiscount > 0) {
      f.discount = couponDiscount;
      f.couponCode = couponCode;
      f.grandTotal = f.grandTotal - couponDiscount;
    }
    return f;
  }, [selectedFlight, searchParams, couponDiscount, couponCode]);

  useEffect(() => {
    if (fare) setFareDetails(fare);
  }, [fare]);

  const handlePassengerChange = (index, data, val) => {
    setPassengerData((prev) => {
      const updated = [...prev];
      if (typeof data === 'string' && val !== undefined) {
        updated[index] = { ...updated[index], [data]: val };
        if (data === 'dateOfBirth') updated[index].dob = val;
        if (data === 'dob') updated[index].dateOfBirth = val;
      } else if (typeof data === 'object' && data !== null) {
        const patch = { ...data };
        if (patch.dateOfBirth) patch.dob = patch.dateOfBirth;
        if (patch.dob) patch.dateOfBirth = patch.dob;
        updated[index] = { ...updated[index], ...patch };
      }
      return updated;
    });
    // Clear error for this passenger
    if (errors[index]) {
      setErrors((prev) => { const next = { ...prev }; delete next[index]; return next; });
    }
  };

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const result = applyCoupon(couponInput.trim());
    setCouponMsg({ text: result.message, type: result.success ? 'success' : 'danger' });
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponInput('');
    setCouponMsg({ text: 'Coupon removed.', type: 'info' });
  };

  const validate = () => {
    const errs = {};
    passengerData.forEach((p, i) => {
      const pErrs = [];
      if (!p.firstName?.trim()) pErrs.push('First name is required.');
      if (!p.lastName?.trim()) pErrs.push('Last name is required.');
      const birthDate = p.dob || p.dateOfBirth;
      if (!birthDate) pErrs.push('Date of birth is required.');
      if (!p.gender) pErrs.push('Gender is required.');
      if (i === 0 && !p.email) pErrs.push('Email is required.');
      if (i === 0 && p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) pErrs.push('Valid email required.');
      if (i === 0 && !p.phone) pErrs.push('Phone number is required.');
      if (pErrs.length > 0) errs[i] = pErrs;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSubmitting(true);
    setPassengers(passengerData);
    setTimeout(() => {
      createDraft();
      navigate('/payment');
    }, 500);
  };

  if (!selectedFlight || !searchParams) return null;

  const steps = [
    { label: 'Search', icon: 'bi-search', done: true },
    { label: 'Passengers', icon: 'bi-people', active: true },
    { label: 'Payment', icon: 'bi-credit-card' },
    { label: 'Confirmation', icon: 'bi-check-circle' },
  ];

  return (
    <>
      <Navbar />
      <div style={{ background: 'var(--skybook-gray-50)', minHeight: '80vh' }}>
        <div className="container py-4">
          {/* Progress */}
          <div className="d-flex justify-content-center mb-4">
            {steps.map((step, i) => (
              <div key={i} className="d-flex align-items-center">
                <div className={`d-flex align-items-center justify-content-center rounded-circle ${step.active ? 'text-white' : step.done ? 'text-white' : 'text-muted'}`}
                  style={{
                    width: 40, height: 40,
                    background: step.active ? 'var(--skybook-blue)' : step.done ? 'var(--skybook-green)' : 'var(--skybook-gray-200)',
                    fontSize: '0.9rem'
                  }}>
                  <i className={`bi ${step.done && !step.active ? 'bi-check-lg' : step.icon}`}></i>
                </div>
                <span className={`d-none d-md-inline ms-1 me-3 small ${step.active ? 'fw-bold' : 'text-muted'}`}>{step.label}</span>
                {i < steps.length - 1 && <div style={{ width: 40, height: 2, background: 'var(--skybook-gray-300)' }} className="me-2"></div>}
              </div>
            ))}
          </div>

          <div className="row g-4">
            {/* Forms */}
            <div className="col-lg-8">
              <h4 className="fw-bold mb-4" style={{ color: 'var(--skybook-navy)' }}>
                <i className="bi bi-people me-2"></i>Passenger Details
              </h4>

              {/* Flight summary bar */}
              <div className="skybook-card p-3 mb-4">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-airplane-fill" style={{ color: 'var(--skybook-blue)' }}></i>
                    <span className="fw-semibold">
                      {typeof selectedFlight.origin === 'object' ? (selectedFlight.origin?.code || selectedFlight.origin?.city) : (selectedFlight.origin || 'BOM')} →{' '}
                      {typeof selectedFlight.destination === 'object' ? (selectedFlight.destination?.code || selectedFlight.destination?.city) : (selectedFlight.destination || 'DEL')}
                    </span>
                    <span className="text-muted small">
                      | {selectedFlight.airline} {selectedFlight.flightNumber} · <span className="badge bg-primary">{selectedFlight.cabinClass || searchParams?.cabinClass || 'Economy'}</span>
                    </span>
                  </div>
                  <span className="text-muted small">{searchParams?.departureDate || searchParams?.departDate}</span>
                </div>
              </div>

              {/* Passenger Accordion */}
              <div className="accordion" id="passengerAccordion">
                {passengerData.map((passenger, idx) => (
                  <div className="accordion-item skybook-card mb-3 border-0" key={idx}>
                    <h2 className="accordion-header">
                      <button className={`accordion-button ${idx !== 0 ? 'collapsed' : ''}`} type="button"
                        data-bs-toggle="collapse" data-bs-target={`#passenger${idx}`}>
                        <i className="bi bi-person me-2"></i>
                        Passenger {idx + 1} — {passengerSlots[idx]?.type || 'Adult'}
                        {passenger.firstName && ` (${passenger.firstName} ${passenger.lastName})`}
                        {errors[idx] && <span className="badge bg-danger ms-2">Error</span>}
                      </button>
                    </h2>
                    <div id={`passenger${idx}`} className={`accordion-collapse collapse ${idx === 0 ? 'show' : ''}`}
                      data-bs-parent="#passengerAccordion">
                      <div className="accordion-body">
                        <PassengerForm
                          index={idx}
                          passengerType={passengerSlots[idx]?.type || 'Adult'}
                          passenger={passenger}
                          onChange={(data) => handlePassengerChange(idx, data)}
                          errors={errors[idx] || []}
                          showContact={idx === 0}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon section */}
              <div className="skybook-card p-4 mt-4">
                <h6 className="fw-bold mb-3"><i className="bi bi-tag me-2"></i>Have a Coupon Code?</h6>
                {couponCode ? (
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success px-3 py-2">
                      <i className="bi bi-check-circle me-1"></i>{couponCode} Applied — Save ₹{couponDiscount.toLocaleString('en-IN')}
                    </span>
                    <button className="btn btn-sm btn-outline-danger" onClick={handleRemoveCoupon}>Remove</button>
                  </div>
                ) : (
                  <div className="input-group">
                    <input type="text" className="form-control skybook-input" placeholder="Enter coupon code"
                      value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} />
                    <button className="btn btn-skybook-outline" onClick={handleApplyCoupon}>Apply</button>
                  </div>
                )}
                {couponMsg.text && (
                  <small className={`text-${couponMsg.type} d-block mt-2`}>{couponMsg.text}</small>
                )}
                <small className="text-muted d-block mt-2">
                  Try: SKYBOOK10, FIRST500, FLY20, WELCOME, SUMMER25
                </small>
              </div>

              {/* Submit */}
              <div className="mt-4 d-flex gap-2">
                <button className="btn btn-skybook-outline" onClick={() => navigate(-1)}>
                  <i className="bi bi-arrow-left me-2"></i>Back
                </button>
                <button className="btn btn-skybook flex-grow-1 py-3" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Processing…</>
                  ) : (
                    <><i className="bi bi-credit-card me-2"></i>Proceed to Payment</>
                  )}
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              {fare && (
                <div style={{ position: 'sticky', top: 90 }}>
                  <BookingSummary
                    flight={selectedFlight}
                    searchParams={searchParams}
                    fareDetails={fare}
                    couponCode={couponCode}
                    couponDiscount={couponDiscount}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
