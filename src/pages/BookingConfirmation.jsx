import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EmptyState from '../components/EmptyState';

export default function BookingConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      try {
        const bookings = JSON.parse(localStorage.getItem('skybook_bookings')) || [];
        // Find by id or by PNR
        const found = bookings.find((b) => b.id === id || b.pnr === id);
        setBooking(found || null);
      } catch {
        setBooking(null);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => setShowAnimation(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAnimation]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Loading your booking…</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <Navbar />
        <div className="container py-5">
          <EmptyState icon="bi-ticket-perforated" title="Booking Not Found"
            message="We couldn't find this booking. It may have been removed or the link is invalid."
            actionText="Go Home" onAction={() => navigate('/')} />
        </div>
        <Footer />
      </>
    );
  }

  const flight = booking.flight;
  const fare = booking.fareDetails;
  const eTicket = `ET-${Date.now().toString().slice(-12)}`;

  return (
    <>
      <Navbar />
      <div style={{ background: 'var(--skybook-gray-50)', minHeight: '80vh' }} className="pb-5">
        <div className="container py-4">
          {/* Progress - Complete */}
          <div className="d-flex justify-content-center mb-4 no-print">
            {['Search', 'Passengers', 'Payment', 'Confirmation'].map((label, i) => (
              <div key={i} className="d-flex align-items-center">
                <div className="d-flex align-items-center justify-content-center rounded-circle text-white"
                  style={{ width: 40, height: 40, background: 'var(--skybook-green)' }}>
                  <i className="bi bi-check-lg"></i>
                </div>
                <span className={`d-none d-md-inline ms-1 me-3 small ${i === 3 ? 'fw-bold' : 'text-muted'}`}>{label}</span>
                {i < 3 && <div style={{ width: 40, height: 2, background: 'var(--skybook-green)' }} className="me-2"></div>}
              </div>
            ))}
          </div>

          {/* Success Animation */}
          <div className="text-center mb-4">
            <div className={`d-inline-flex align-items-center justify-content-center rounded-circle mb-3 ${showAnimation ? 'skybook-pulse' : ''}`}
              style={{ width: 100, height: 100, background: '#dcfce7' }}>
              <i className="bi bi-check-circle-fill" style={{ fontSize: '3rem', color: 'var(--skybook-green)' }}></i>
            </div>
            <h3 className="fw-bold" style={{ color: 'var(--skybook-green)' }}>Booking Confirmed!</h3>
            <p className="text-muted">Your flight has been booked successfully.</p>
          </div>

          {/* Printable Ticket */}
          <div className="skybook-card mx-auto" style={{ maxWidth: 800 }} id="printable-ticket">
            {/* Ticket Header */}
            <div className="p-4 text-white" style={{ background: 'var(--skybook-gradient)' }}>
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-airplane-fill fs-4"></i>
                  <span className="fw-bold fs-5">SkyBook</span>
                </div>
                <div className="text-end">
                  <small className="d-block opacity-75">Booking Reference</small>
                  <span className="fw-bold fs-4 font-monospace">{booking.pnr || 'SKY-' + booking.id.slice(-6).toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="p-4">
              {/* E-Ticket */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <small className="text-muted">E-Ticket Number</small>
                  <p className="fw-bold font-monospace mb-0">{eTicket}</p>
                </div>
                <div className="col-md-3">
                  <small className="text-muted">Booking Date</small>
                  <p className="fw-semibold mb-0">{new Date(booking.confirmedAt || booking.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="col-md-3">
                  <small className="text-muted">Payment Status</small>
                  <p className="mb-0"><span className="badge bg-success">Paid — Demo Mode</span></p>
                </div>
              </div>

              <hr />

              {/* Flight Details */}
              <h6 className="fw-bold mb-3"><i className="bi bi-airplane me-2"></i>Flight Details</h6>
              <div className="row align-items-center text-center mb-4 p-3 rounded" style={{ background: 'var(--skybook-gray-50)' }}>
                <div className="col-4">
                  <h4 className="fw-bold mb-0">{flight?.departureTime}</h4>
                  <p className="fw-semibold mb-0">{flight?.origin?.code}</p>
                  <small className="text-muted">{flight?.origin?.city}</small>
                </div>
                <div className="col-4">
                  <small className="text-muted">{flight?.duration}</small>
                  <div className="position-relative mx-2">
                    <hr style={{ borderTop: '2px dashed var(--skybook-blue)' }} />
                    <i className="bi bi-airplane-fill position-absolute top-50 start-50 translate-middle"
                      style={{ color: 'var(--skybook-blue)' }}></i>
                  </div>
                  <small className="text-muted">{flight?.airline} · {flight?.flightNumber}</small>
                </div>
                <div className="col-4">
                  <h4 className="fw-bold mb-0">{flight?.arrivalTime}</h4>
                  <p className="fw-semibold mb-0">{flight?.destination?.code}</p>
                  <small className="text-muted">{flight?.destination?.city}</small>
                </div>
              </div>

              {/* Travel Date */}
              <div className="mb-4">
                <small className="text-muted">Travel Date</small>
                <p className="fw-semibold mb-0">{booking.searchParams?.departureDate || 'N/A'}</p>
              </div>

              {/* Passengers */}
              <h6 className="fw-bold mb-3"><i className="bi bi-people me-2"></i>Passengers</h6>
              <div className="table-responsive mb-4">
                <table className="table table-sm">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(booking.passengers || []).map((p, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td className="fw-semibold">{p.title} {p.firstName} {p.lastName}</td>
                        <td><span className="badge bg-light text-dark">{p.type}</span></td>
                        <td>{p.gender}</td>
                      </tr>
                    ))}
                    {(!booking.passengers || booking.passengers.length === 0) && (
                      <tr><td colSpan="4" className="text-muted text-center">No passenger details available</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Fare */}
              <h6 className="fw-bold mb-3"><i className="bi bi-receipt me-2"></i>Fare Summary</h6>
              <div className="p-3 rounded mb-4" style={{ background: 'var(--skybook-gray-50)' }}>
                <div className="d-flex justify-content-between small mb-1">
                  <span>Base Fare</span>
                  <span>₹{(fare?.baseFare || fare?.adultFare || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="d-flex justify-content-between small mb-1">
                  <span>Taxes & Fees</span>
                  <span>₹{(fare?.taxes || 0).toLocaleString('en-IN')}</span>
                </div>
                {(fare?.discount || 0) > 0 && (
                  <div className="d-flex justify-content-between small mb-1 text-success">
                    <span>Discount {fare?.couponCode && `(${fare.couponCode})`}</span>
                    <span>-₹{fare.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--skybook-blue)' }}>₹{(fare?.grandTotal || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-2 rounded text-center small text-muted" style={{ background: '#f0f9ff' }}>
                <i className="bi bi-info-circle me-1"></i>
                This is a demo booking. No real airline reservation has been made.
                Sample data only — not a real ticket.
              </div>
            </div>
          </div>

          {/* Action Buttons - not printed */}
          <div className="d-flex flex-wrap justify-content-center gap-3 mt-4 no-print">
            <button className="btn btn-skybook" onClick={handlePrint}>
              <i className="bi bi-printer me-2"></i>Print Ticket
            </button>
            <Link to="/my-bookings" className="btn btn-skybook-outline">
              <i className="bi bi-journal-text me-2"></i>View My Bookings
            </Link>
            <Link to="/" className="btn btn-skybook-navy">
              <i className="bi bi-house me-2"></i>Return Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
