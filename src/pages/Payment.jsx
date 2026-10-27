import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import BookingSummary from '../components/BookingSummary';
import { createPayment, simulatePayment } from '../services/paymentService';
import { confirmBooking } from '../services/bookingService';

export default function Payment() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    selectedFlight, searchParams, draftBooking, fareDetails, passengers,
    confirmCurrentBooking, couponCode, couponDiscount,
  } = useBooking();

  const [paymentMethod, setPaymentMethod] = useState('demo');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null); // { type: 'success'|'error'|'warning', msg }

  // Redirect if no draft booking
  useEffect(() => {
    if (!draftBooking && !selectedFlight) {
      navigate('/flights');
    }
  }, [draftBooking, selectedFlight, navigate]);

  const booking = draftBooking;
  const fare = fareDetails || booking?.fareDetails;

  const handleSimulatePayment = (outcome) => {
    setProcessing(true);
    setResult(null);

    setTimeout(() => {
      if (outcome === 'success') {
        // Create payment record
        const paymentRecord = createPayment(
          booking?.id || 'DRAFT',
          fare?.grandTotal || 0,
          paymentMethod
        );
        simulatePayment(paymentRecord.id, 'success');

        // Confirm booking
        const confirmed = confirmCurrentBooking(paymentRecord.id);

        // Also persist in bookingService
        try {
          confirmBooking(booking?.id, paymentRecord.id, currentUser?.id);
        } catch (e) {
          // Fallback — BookingContext already persisted
        }

        setResult({ type: 'success', msg: 'Payment successful! Redirecting to confirmation…' });
        setTimeout(() => {
          navigate(`/booking-confirmation/${confirmed?.id || booking?.id}`);
        }, 1500);
      } else if (outcome === 'failed') {
        setResult({ type: 'error', msg: 'Payment failed. Please try again or choose a different payment method.' });
        setProcessing(false);
      } else {
        setResult({ type: 'warning', msg: 'Payment cancelled. You can retry when ready.' });
        setProcessing(false);
      }
    }, 1500);
  };

  if (!booking && !selectedFlight) return null;

  const steps = [
    { label: 'Search', icon: 'bi-search', done: true },
    { label: 'Passengers', icon: 'bi-people', done: true },
    { label: 'Payment', icon: 'bi-credit-card', active: true },
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
                  }}>
                  <i className={`bi ${step.done && !step.active ? 'bi-check-lg' : step.icon}`}></i>
                </div>
                <span className={`d-none d-md-inline ms-1 me-3 small ${step.active ? 'fw-bold' : 'text-muted'}`}>{step.label}</span>
                {i < steps.length - 1 && <div style={{ width: 40, height: 2, background: 'var(--skybook-gray-300)' }} className="me-2"></div>}
              </div>
            ))}
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <h4 className="fw-bold mb-4" style={{ color: 'var(--skybook-navy)' }}>
                <i className="bi bi-credit-card me-2"></i>Payment
              </h4>

              {/* Booking Reference */}
              {booking?.id && (
                <div className="skybook-card p-3 mb-4">
                  <small className="text-muted">Draft Booking ID</small>
                  <p className="fw-bold mb-0" style={{ color: 'var(--skybook-blue)' }}>{booking.id}</p>
                </div>
              )}

              {/* Flight & Passenger Summary */}
              <div className="skybook-card p-4 mb-4">
                <h6 className="fw-bold mb-3"><i className="bi bi-airplane me-2"></i>Flight Summary</h6>
                {selectedFlight && (
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <div>
                      <span className="fw-semibold">
                        {typeof selectedFlight.origin === 'object' ? (selectedFlight.origin?.code || selectedFlight.origin?.city) : (selectedFlight.origin || 'BOM')} →{' '}
                        {typeof selectedFlight.destination === 'object' ? (selectedFlight.destination?.code || selectedFlight.destination?.city) : (selectedFlight.destination || 'DEL')}
                      </span>
                      <span className="text-muted small ms-2">
                        | {selectedFlight.airline} {selectedFlight.flightNumber} · <span className="badge bg-primary">{selectedFlight.cabinClass || searchParams?.cabinClass || 'Economy'}</span>
                      </span>
                    </div>
                    <span className="text-muted small">{searchParams?.departureDate || searchParams?.departDate}</span>
                  </div>
                )}
                {booking?.passengers && booking.passengers.length > 0 && (
                  <>
                    <h6 className="fw-bold mb-2 small"><i className="bi bi-people me-2"></i>Passengers</h6>
                    <ul className="list-unstyled mb-0">
                      {booking.passengers.map((p, i) => (
                        <li key={i} className="small text-muted">
                          {p.title} {p.firstName} {p.lastName} ({p.type})
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Payment Method */}
              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onMethodChange={setPaymentMethod}
                onSimulatePayment={handleSimulatePayment}
                processing={processing}
              />

              {/* Result messages */}
              {result && (
                <div className={`alert alert-${result.type === 'error' ? 'danger' : result.type} mt-4`}>
                  <i className={`bi ${result.type === 'success' ? 'bi-check-circle' : result.type === 'error' ? 'bi-x-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                  {result.msg}
                  {result.type === 'success' && (
                    <div className="mt-2">
                      <div className="spinner-border spinner-border-sm me-2"></div>
                      Redirecting…
                    </div>
                  )}
                </div>
              )}

              {/* Disclaimer */}
              <div className="mt-4 p-3 rounded small" style={{ background: '#fff3cd' }}>
                <i className="bi bi-shield-exclamation me-2 text-warning"></i>
                <strong>Important:</strong> This is a simulated payment for demonstration purposes only.
                No real money is charged. Real payments require a trusted payment provider (Razorpay, Stripe, etc.)
                with server-side verification. Never embed secret API keys in frontend code.
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div style={{ position: 'sticky', top: 90 }}>
                {fare && selectedFlight && (
                  <BookingSummary
                    flight={selectedFlight}
                    searchParams={searchParams}
                    fareDetails={fare}
                    couponCode={couponCode}
                    couponDiscount={couponDiscount}
                  />
                )}

                <div className="skybook-card p-3 mt-3">
                  <div className="d-flex justify-content-between fw-bold fs-5">
                    <span>Total Payable</span>
                    <span style={{ color: 'var(--skybook-blue)' }}>₹{(fare?.grandTotal || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
