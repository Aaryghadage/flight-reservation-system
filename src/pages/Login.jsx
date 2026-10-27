import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const fillDemo = () => {
    setForm({ email: 'demo@skybook.com', password: 'Demo@1234' });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    // Simulate brief network delay
    setTimeout(() => {
      const result = login(form.email, form.password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.message);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <>
      <Navbar />
      <div className="skybook-auth-page">
        <div className="container">
          <div className="row justify-content-center align-items-center min-vh-100 py-5">
            <div className="col-11 col-sm-8 col-md-6 col-lg-5 col-xl-4">
              <div className="skybook-card p-4 p-md-5">
                {/* Brand */}
                <div className="text-center mb-4">
                  <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                    <i className="bi bi-airplane-fill fs-3" style={{ color: 'var(--skybook-blue)' }}></i>
                    <span className="fw-bold fs-3" style={{ color: 'var(--skybook-navy)' }}>SkyBook</span>
                  </div>
                  <h4 className="fw-bold mb-1" style={{ color: 'var(--skybook-navy)' }}>Welcome Back</h4>
                  <p className="text-muted small">Sign in to continue your journey</p>
                </div>

                {/* Error */}
                {error && (
                  <div className="alert alert-danger py-2 small">
                    <i className="bi bi-exclamation-circle me-2"></i>{error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                      <input
                        type="email"
                        className="form-control skybook-input"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Password</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-lock"></i></span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control skybook-input"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="input-group-text"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Remember + Forgot */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        id="rememberMe"
                      />
                      <label className="form-check-label small" htmlFor="rememberMe">Remember me</label>
                    </div>
                  </div>

                  {/* Submit */}
                  <button type="submit" className="btn btn-skybook w-100 mb-3" disabled={loading}>
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Signing In…</>
                    ) : (
                      <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>
                    )}
                  </button>

                  {/* Demo */}
                  <button type="button" className="btn btn-skybook-outline w-100 mb-3" onClick={fillDemo}>
                    <i className="bi bi-person-badge me-2"></i>Use Demo Account
                  </button>
                </form>

                <p className="text-center mb-0 small text-muted">
                  Don't have an account?{' '}
                  <Link to="/signup" className="fw-semibold">Sign Up</Link>
                </p>

                {/* Disclaimer */}
                <div className="mt-4 p-2 rounded small text-muted text-center" style={{ background: 'var(--skybook-gray-100)', fontSize: '0.7rem' }}>
                  <i className="bi bi-info-circle me-1"></i>
                  This is a demo authentication system using Local Storage. Not suitable for production.
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
