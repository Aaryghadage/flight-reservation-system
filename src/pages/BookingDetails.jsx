import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EmptyState from '../components/EmptyState';

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      try {
        const all = JSON.parse(localStorage.getItem('skybook_bookings')) || [];
        setBooking(all.find(b => b.id === id) || null);
      } catch {
        setBooking(null);
      }
      setLoading(false);
    }, 400);
  }, [id]);

  const handleCancel = () => {
    try {
      const all = JSON.parse(localStorage.getItem('skybook_bookings')) || [];
      const updated = all.map(b =>
        b.id === id ? { ...b, status: 'cancelled', cancelledAt: new Date().toISOString() } : b
      );
      localStorage.setItem('skybook_bookings', JSON.stringify(updated));
      setBooking(updated.find(b => b.id === id));
      setCancelModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <><Navbar /><div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div><p className="mt-3 text-muted">Loading…</p>
      </div><Footer /></>
    );
  }

  if (!booking) {
    return (
      <><Navbar /><div className="container py-5">
        <EmptyState icon="bi-journal-x" title="Booking Not Found"
          message="This booking doesn't exist." actionText="My Bookings" onAction={() => navigate('/my-bookings')} />
      </div><Footer /></>
    );
  }

  const flight = booking.flight;
  const fare = booking.fareDetails;
  const isConfirmed = booking.status === 'confirmed';

  return (
    <>
      <Navbar />
      <div style={{ background: 'var(--skybook-gray-50)', minHeight: '80vh' }}>
        <div className="container py-4">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="breadcrumb small">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/my-bookings">My Bookings</Link></li>
              <li className="breadcrumb-item active">{booking.pnr || booking.id?.slice(-8)}</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
            <div>
              <h3 className="fw-bold mb-1" style={{ color: 'var(--skybook-navy)' }}>Booking Details</h3>
              <span className="font-monospace fw-bold" style={{ color: 'var(--skybook-blue)', fontSize: '1.2rem' }}>
                {booking.pnr || 'SKY-' + booking.id?.slice(-6).toUpperCase()}
              </span>
              <span className={`badge ms-3 ${booking.status === 'confirmed' ? 'badge-confirmed' : 'badge-cancelled'}`}>
                {booking.status?.toUpperCase()}
              </span>
            </div>
            <div className="d-flex gap-2">
              {isConfirmed && (
                <button className="btn btn-skybook" onClick={() => navigate(`/booking-confirmation/${booking.id}`)}>
                  <i className="bi bi-printer me-1"></i>Print Ticket
                </button>
              )}
              {isConfirmed && (
                <button className="btn btn-outline-danger" onClick={() => setCancelModal(true)}>
                  <i className="bi bi-x-circle me-1"></i>Cancel
                </button>
              )}
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              {/* Flight */}
              <div className="skybook-card p-4 mb-4">
                <h5 className="fw-bold mb-3"><i className="bi bi-airplane me-2"></i>Flight Itinerary</h5>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                    style={{ width: 44, height: 44, background: 'var(--skybook-gradient)', fontSize: '0.8rem' }}>
                    {flight?.airlineLogo || flight?.airline?.substring(0, 2)}
                  </div>
                  <div>
                    <span className="fw-semibold">{flight?.airline}</span>
                    <small className="d-block text-muted">{flight?.flightNumber} · {flight?.aircraft}</small>
                  </div>
                </div>

                <div className="row align-items-center text-center p-3 rounded" style={{ background: 'var(--skybook-gray-50)' }}>
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
                    <span className={`badge ${flight?.stops === 0 ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {flight?.stops === 0 ? 'Nonstop' : `${flight?.stops} Stop(s)`}
                    </span>
                  </div>
                  <div className="col-4">
                    <h4 className="fw-bold mb-0">{flight?.arrivalTime}</h4>
                    <p className="fw-semibold mb-0">{flight?.destination?.code}</p>
                    <small className="text-muted">{flight?.destination?.city}</small>
                  </div>
                </div>

                <div className="mt-3 d-flex flex-wrap gap-3">
                  <div><small className="text-muted">Travel Date</small><p className="fw-semibold mb-0">{booking.searchParams?.departureDate || 'N/A'}</p></div>
                  <div><small className="text-muted">Cabin</small><p className="fw-semibold mb-0">{flight?.cabinClass}</p></div>
                  <div><small className="text-muted">Baggage</small><p className="fw-semibold mb-0">{typeof flight?.baggage === 'object' ? `${flight?.baggage?.cabin || '7 kg'} cabin + ${flight?.baggage?.checkin || '15 kg'} check-in` : (flight?.baggage || '7 kg cabin + 15 kg check-in')}</p></div>
                </div>
              </div>

              {/* Passengers */}
              <div className="skybook-card p-4 mb-4">
                <h5 className="fw-bold mb-3"><i className="bi bi-people me-2"></i>Passengers</h5>
                <div className="table-responsive">
                  <table className="table">
                    <thead className="table-light">
                      <tr><th>#</th><th>Name</th><th>Type</th><th>Gender</th><th>DOB</th></tr>
                    </thead>
                    <tbody>
                      {(booking.passengers || []).map((p, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td className="fw-semibold">{p.title} {p.firstName} {p.lastName}</td>
                          <td><span className="badge bg-light text-dark">{p.type}</span></td>
                          <td>{p.gender}</td>
                          <td>{p.dob || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="skybook-card p-4">
                <h5 className="fw-bold mb-3"><i className="bi bi-info-circle me-2"></i>Cancellation Policy</h5>
                <ul className="small text-muted">
                  <li>Cancellation fee: ₹{(flight?.cancellationFee || 500).toLocaleString('en-IN')} per passenger</li>
                  <li>Cancellations must be made at least 2 hours before departure</li>
                  <li>Refund processed within 5-7 business days (simulated)</li>
                  <li>No-show: Full fare forfeited</li>
                </ul>
                <p className="small text-muted mb-0"><i className="bi bi-exclamation-circle me-1"></i>These are demo cancellation rules. No real refund is processed.</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              {/* Payment Info */}
              <div className="skybook-card p-4 mb-3">
                <h6 className="fw-bold mb-3"><i className="bi bi-credit-card me-2"></i>Payment Details</h6>
                <div className="d-flex justify-content-between small mb-2">
                  <span className="text-muted">Payment Status</span>
                  <span className="badge bg-success">Paid — Demo</span>
                </div>
                <div className="d-flex justify-content-between small mb-2">
                  <span className="text-muted">Payment ID</span>
                  <span className="font-monospace">{booking.paymentId || 'N/A'}</span>
                </div>
                <div className="d-flex justify-content-between small mb-2">
                  <span className="text-muted">Booking Date</span>
                  <span>{new Date(booking.confirmedAt || booking.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>

              {/* Fare */}
              <div className="skybook-card p-4">
                <h6 className="fw-bold mb-3"><i className="bi bi-receipt me-2"></i>Fare Summary</h6>
                <div className="d-flex justify-content-between small mb-2">
                  <span>Base Fare</span><span>₹{(fare?.baseFare || fare?.adultFare || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="d-flex justify-content-between small mb-2">
                  <span>Taxes & Fees</span><span>₹{(fare?.taxes || 0).toLocaleString('en-IN')}</span>
                </div>
                {(fare?.discount || 0) > 0 && (
                  <div className="d-flex justify-content-between small mb-2 text-success">
                    <span>Discount</span><span>-₹{fare.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span style={{ color: 'var(--skybook-blue)' }}>₹{(fare?.grandTotal || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Link to="/my-bookings" className="btn btn-skybook-outline w-100 mt-3">
                <i className="bi bi-arrow-left me-2"></i>Back to Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setCancelModal(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger"><i className="bi bi-exclamation-triangle me-2"></i>Cancel Booking</h5>
                <button className="btn-close" onClick={() => setCancelModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to cancel this booking?</p>
                <p className="small text-muted">This is a demo cancellation. Any refund shown is simulated.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setCancelModal(false)}>Keep Booking</button>
                <button className="btn btn-danger" onClick={handleCancel}>Cancel Booking</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
