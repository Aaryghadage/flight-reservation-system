import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EmptyState from '../components/EmptyState';
import { FlightCardSkeleton } from '../components/LoadingSkeleton';

export default function MyBookings() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cancelModal, setCancelModal] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      try {
        const all = JSON.parse(localStorage.getItem('skybook_bookings')) || [];
        // Filter by user if logged in (or show all for demo)
        const userBookings = all.filter(b =>
          !currentUser || !b.userId || b.userId === currentUser.id || !b.userId
        );
        setBookings(userBookings.sort((a, b) => new Date(b.confirmedAt || b.createdAt) - new Date(a.confirmedAt || a.createdAt)));
      } catch {
        setBookings([]);
      }
      setLoading(false);
    }, 600);
  }, [currentUser]);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = !search ||
      (b.pnr || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.flight?.origin?.city || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.flight?.destination?.city || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.flight?.airline || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCancel = (bookingId) => {
    try {
      const all = JSON.parse(localStorage.getItem('skybook_bookings')) || [];
      const updated = all.map(b => {
        if (b.id === bookingId) {
          return { ...b, status: 'cancelled', cancelledAt: new Date().toISOString() };
        }
        return b;
      });
      localStorage.setItem('skybook_bookings', JSON.stringify(updated));
      setBookings(updated.sort((a, b) => new Date(b.confirmedAt || b.createdAt) - new Date(a.confirmedAt || a.createdAt)));
      setCancelModal(null);
    } catch (e) {
      console.error('Cancel error:', e);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      confirmed: 'badge-confirmed',
      cancelled: 'badge-cancelled',
      pending: 'badge-pending',
      draft: 'badge-pending',
    };
    return map[status] || 'bg-secondary';
  };

  return (
    <>
      <Navbar />
      <div style={{ background: 'var(--skybook-gray-50)', minHeight: '80vh' }}>
        <div className="container py-4">
          <h3 className="fw-bold mb-1" style={{ color: 'var(--skybook-navy)' }}>
            <i className="bi bi-journal-text me-2"></i>My Bookings
          </h3>
          <p className="text-muted mb-4">View and manage your flight bookings</p>

          {/* Search and Filter */}
          <div className="row g-3 mb-4">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input type="text" className="form-control skybook-input"
                  placeholder="Search by booking reference, route, or airline…"
                  value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="col-md-4">
              <div className="btn-group w-100">
                {['all', 'confirmed', 'cancelled'].map((s) => (
                  <button key={s} className={`btn ${statusFilter === s ? 'btn-skybook' : 'btn-outline-secondary'}`}
                    onClick={() => setStatusFilter(s)}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="row g-3">
              {[1, 2, 3].map((i) => <div className="col-12" key={i}><FlightCardSkeleton /></div>)}
            </div>
          )}

          {/* Empty */}
          {!loading && filteredBookings.length === 0 && (
            <EmptyState
              icon="bi-journal-x"
              title="No Bookings Found"
              message={search || statusFilter !== 'all' ? 'Try adjusting your search or filter.' : "You haven't made any bookings yet. Start your journey!"}
              actionText="Search Flights"
              onAction={() => navigate('/')}
            />
          )}

          {/* Booking Cards */}
          {!loading && filteredBookings.map((b) => (
            <div className="skybook-card p-4 mb-3" key={b.id}>
              <div className="row align-items-center g-3">
                <div className="col-md-2">
                  <small className="text-muted d-block">Booking Ref</small>
                  <span className="fw-bold font-monospace" style={{ color: 'var(--skybook-blue)' }}>
                    {b.pnr || b.id?.slice(-8).toUpperCase()}
                  </span>
                  <br />
                  <span className={`badge ${getStatusBadge(b.status)} mt-1`}>
                    {b.status?.charAt(0).toUpperCase() + b.status?.slice(1)}
                  </span>
                </div>

                <div className="col-md-4">
                  <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                      style={{ width: 36, height: 36, background: 'var(--skybook-gradient)', fontSize: '0.7rem' }}>
                      {b.flight?.airlineLogo || b.flight?.airline?.substring(0, 2) || 'SK'}
                    </div>
                    <div>
                      <span className="fw-semibold">{(typeof b.flight?.origin === 'object' ? b.flight?.origin?.code : b.flight?.origin) || '—'} → {(typeof b.flight?.destination === 'object' ? b.flight?.destination?.code : b.flight?.destination) || '—'}</span>
                      <small className="d-block text-muted">{b.flight?.airline} · {b.flight?.flightNumber}</small>
                    </div>
                  </div>
                </div>

                <div className="col-md-2">
                  <small className="text-muted d-block">Travel Date</small>
                  <span className="small fw-semibold">{b.searchParams?.departureDate || 'N/A'}</span>
                </div>

                <div className="col-md-2">
                  <small className="text-muted d-block">Amount</small>
                  <span className="fw-bold" style={{ color: 'var(--skybook-navy)' }}>
                    ₹{(b.fareDetails?.grandTotal || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="col-md-2">
                  <div className="d-flex flex-column gap-1">
                    <Link to={`/booking-details/${b.id}`} className="btn btn-sm btn-skybook">
                      <i className="bi bi-eye me-1"></i>View
                    </Link>
                    {b.status === 'confirmed' && (
                      <>
                        <button className="btn btn-sm btn-skybook-outline" onClick={() => {
                          navigate(`/booking-confirmation/${b.id}`);
                        }}>
                          <i className="bi bi-printer me-1"></i>Print
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setCancelModal(b.id)}>
                          <i className="bi bi-x-circle me-1"></i>Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setCancelModal(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><i className="bi bi-exclamation-triangle text-warning me-2"></i>Cancel Booking</h5>
                <button className="btn-close" onClick={() => setCancelModal(null)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to cancel this booking? This action cannot be undone.</p>
                <p className="small text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  This is a demo cancellation. In a real system, cancellation fees would apply and refund processing would take 5-7 business days.
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setCancelModal(null)}>Keep Booking</button>
                <button className="btn btn-danger" onClick={() => handleCancel(cancelModal)}>
                  <i className="bi bi-x-circle me-1"></i>Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
