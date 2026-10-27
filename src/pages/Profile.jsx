import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import storageService from '../services/storageService';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, updateProfile, logout } = useAuth();

  const [form, setForm] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [stats, setStats] = useState({ total: 0, active: 0, cancelled: 0 });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    try {
      const all = JSON.parse(localStorage.getItem('skybook_bookings')) || [];
      const userBookings = all.filter(b => !b.userId || b.userId === currentUser?.id);
      setStats({
        total: userBookings.length,
        active: userBookings.filter(b => b.status === 'confirmed').length,
        cancelled: userBookings.filter(b => b.status === 'cancelled').length,
      });
      setRecentBookings(
        userBookings
          .sort((a, b) => new Date(b.confirmedAt || b.createdAt) - new Date(a.confirmedAt || a.createdAt))
          .slice(0, 3)
      );
    } catch {
      // ignore
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsg({ text: '', type: '' });
  };

  const handleSave = () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setMsg({ text: 'Name and email are required.', type: 'danger' });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const result = updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
      });
      if (result.success) {
        setMsg({ text: 'Profile updated successfully!', type: 'success' });
        setEditing(false);
      } else {
        setMsg({ text: result.message, type: 'danger' });
      }
      setSaving(false);
    }, 500);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleResetData = () => {
    if (window.confirm('This will clear ALL SkyBook demo data including your bookings. Continue?')) {
      storageService.resetDemoData();
      logout();
      navigate('/');
    }
  };

  const initials = (currentUser?.firstName?.[0] || '') + (currentUser?.lastName?.[0] || '');

  return (
    <>
      <Navbar />
      <div style={{ background: 'var(--skybook-gray-50)', minHeight: '80vh' }}>
        <div className="container py-4">
          <div className="row g-4">
            {/* Profile Header */}
            <div className="col-lg-4">
              <div className="skybook-card p-4 text-center">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle text-white fw-bold mb-3"
                  style={{ width: 80, height: 80, background: 'var(--skybook-gradient)', fontSize: '1.8rem' }}>
                  {initials || 'U'}
                </div>
                <h5 className="fw-bold mb-1">{currentUser?.firstName} {currentUser?.lastName}</h5>
                <p className="text-muted small mb-3">{currentUser?.email}</p>
                <small className="text-muted">
                  Member since {new Date(currentUser?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </small>
              </div>

              {/* Stats */}
              <div className="skybook-card p-4 mt-3">
                <h6 className="fw-bold mb-3"><i className="bi bi-bar-chart me-2"></i>Booking Stats</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Total Bookings</span>
                  <span className="fw-bold">{stats.total}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Active</span>
                  <span className="fw-bold text-success">{stats.active}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted small">Cancelled</span>
                  <span className="fw-bold text-danger">{stats.cancelled}</span>
                </div>
              </div>
            </div>

            {/* Main */}
            <div className="col-lg-8">
              {/* Edit Profile */}
              <div className="skybook-card p-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0" style={{ color: 'var(--skybook-navy)' }}>
                    <i className="bi bi-person-gear me-2"></i>Profile Information
                  </h5>
                  {!editing ? (
                    <button className="btn btn-sm btn-skybook-outline" onClick={() => setEditing(true)}>
                      <i className="bi bi-pencil me-1"></i>Edit
                    </button>
                  ) : (
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => { setEditing(false); setMsg({ text: '', type: '' }); }}>
                      Cancel
                    </button>
                  )}
                </div>

                {msg.text && (
                  <div className={`alert alert-${msg.type} py-2 small`}>
                    <i className={`bi ${msg.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2`}></i>
                    {msg.text}
                  </div>
                )}

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">First Name</label>
                    <input type="text" className="form-control skybook-input" name="firstName"
                      value={form.firstName} onChange={handleChange} disabled={!editing} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Last Name</label>
                    <input type="text" className="form-control skybook-input" name="lastName"
                      value={form.lastName} onChange={handleChange} disabled={!editing} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Email</label>
                    <input type="email" className="form-control skybook-input" value={form.email} disabled
                      style={{ background: 'var(--skybook-gray-100)' }} />
                    <small className="text-muted">Email cannot be changed in demo mode.</small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Phone</label>
                    <input type="tel" className="form-control skybook-input" name="phone"
                      value={form.phone} onChange={handleChange} disabled={!editing} />
                  </div>
                </div>

                {editing && (
                  <div className="mt-4">
                    <button className="btn btn-skybook" onClick={handleSave} disabled={saving}>
                      {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</> : <><i className="bi bi-check-lg me-2"></i>Save Changes</>}
                    </button>
                  </div>
                )}
              </div>

              {/* Recent Bookings */}
              <div className="skybook-card p-4 mb-4">
                <h5 className="fw-bold mb-3" style={{ color: 'var(--skybook-navy)' }}>
                  <i className="bi bi-clock-history me-2"></i>Recent Bookings
                </h5>
                {recentBookings.length === 0 ? (
                  <p className="text-muted text-center py-3">No bookings yet.</p>
                ) : (
                  recentBookings.map((b, i) => (
                    <div key={i} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                      <div>
                        <span className="fw-semibold small">
                          {(typeof b.flight?.origin === 'object' ? b.flight?.origin?.code : b.flight?.origin) || '—'} →{' '}
                          {(typeof b.flight?.destination === 'object' ? b.flight?.destination?.code : b.flight?.destination) || '—'}
                        </span>
                        <small className="d-block text-muted">{b.flight?.airline} · {b.searchParams?.departureDate}</small>
                      </div>
                      <div className="text-end">
                        <span className={`badge ${b.status === 'confirmed' ? 'badge-confirmed' : 'badge-cancelled'}`}>{b.status}</span>
                        <small className="d-block text-muted">₹{(b.fareDetails?.grandTotal || 0).toLocaleString('en-IN')}</small>
                      </div>
                    </div>
                  ))
                )}
                {recentBookings.length > 0 && (
                  <button className="btn btn-sm btn-skybook-outline mt-3" onClick={() => navigate('/my-bookings')}>
                    View All Bookings
                  </button>
                )}
              </div>

              {/* Danger Zone */}
              <div className="skybook-card p-4 border-danger" style={{ borderColor: '#fee2e2 !important' }}>
                <h5 className="fw-bold text-danger mb-3"><i className="bi bi-exclamation-triangle me-2"></i>Danger Zone</h5>
                <div className="d-flex flex-wrap gap-3">
                  <button className="btn btn-outline-danger" onClick={handleResetData}>
                    <i className="bi bi-arrow-counterclockwise me-2"></i>Reset Demo Data
                  </button>
                  <button className="btn btn-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </button>
                </div>
                <small className="text-muted d-block mt-2">
                  Resetting demo data will clear all bookings, accounts, and settings.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
