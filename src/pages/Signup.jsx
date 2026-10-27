import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    setErrors({ ...errors, [name]: '' });
    setApiError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required.';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.';
    if (!form.phone.trim()) errs.phone = 'Phone number is required.';
    else if (!/^\+?[\d\s-]{7,15}$/.test(form.phone)) errs.phone = 'Enter a valid phone number.';
    if (!form.password) errs.password = 'Password is required.';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    if (!form.agreeTerms) errs.agreeTerms = 'You must accept the terms.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getPasswordStrength = () => {
    const p = form.password;
    if (!p) return { label: '', color: '', width: '0%' };
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { label: 'Weak', color: 'bg-danger', width: '20%' };
    if (score <= 2) return { label: 'Fair', color: 'bg-warning', width: '40%' };
    if (score <= 3) return { label: 'Good', color: 'bg-info', width: '60%' };
    if (score <= 4) return { label: 'Strong', color: 'bg-success', width: '80%' };
    return { label: 'Very Strong', color: 'bg-success', width: '100%' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const result = signup({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });
      if (result.success) {
        navigate('/');
      } else {
        setApiError(result.message);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <>
      <Navbar />
      <div className="skybook-auth-page">
        <div className="container">
          <div className="row justify-content-center align-items-center py-5" style={{ minHeight: '100vh' }}>
            <div className="col-11 col-sm-9 col-md-7 col-lg-6 col-xl-5">
              <div className="skybook-card p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                    <i className="bi bi-airplane-fill fs-3" style={{ color: 'var(--skybook-blue)' }}></i>
                    <span className="fw-bold fs-3" style={{ color: 'var(--skybook-navy)' }}>SkyBook</span>
                  </div>
                  <h4 className="fw-bold mb-1" style={{ color: 'var(--skybook-navy)' }}>Create Account</h4>
                  <p className="text-muted small">Join SkyBook and start exploring</p>
                </div>

                {apiError && (
                  <div className="alert alert-danger py-2 small">
                    <i className="bi bi-exclamation-circle me-2"></i>{apiError}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label fw-semibold small">First Name</label>
                      <input type="text" className={`form-control skybook-input ${errors.firstName ? 'is-invalid' : ''}`}
                        name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" />
                      {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label fw-semibold small">Last Name</label>
                      <input type="text" className={`form-control skybook-input ${errors.lastName ? 'is-invalid' : ''}`}
                        name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" />
                      {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                      <input type="email" className={`form-control skybook-input ${errors.email ? 'is-invalid' : ''}`}
                        name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-phone"></i></span>
                      <input type="tel" className={`form-control skybook-input ${errors.phone ? 'is-invalid' : ''}`}
                        name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label fw-semibold small">Password</label>
                    <div className="input-group">
                      <span className="input-group-text"><i className="bi bi-lock"></i></span>
                      <input type={showPassword ? 'text' : 'password'}
                        className={`form-control skybook-input ${errors.password ? 'is-invalid' : ''}`}
                        name="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" />
                      <button type="button" className="input-group-text"
                        onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                    {form.password && (
                      <div className="mt-1">
                        <div className="progress" style={{ height: '4px' }}>
                          <div className={`progress-bar ${strength.color}`} style={{ width: strength.width }}></div>
                        </div>
                        <small className="text-muted">{strength.label}</small>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Confirm Password</label>
                    <input type="password" className={`form-control skybook-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                  </div>

                  <div className="form-check mb-4">
                    <input className={`form-check-input ${errors.agreeTerms ? 'is-invalid' : ''}`}
                      type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} id="agreeTerms" />
                    <label className="form-check-label small" htmlFor="agreeTerms">
                      I agree to the <a href="#!">Terms & Conditions</a> and <a href="#!">Privacy Policy</a>
                    </label>
                    {errors.agreeTerms && <div className="invalid-feedback">{errors.agreeTerms}</div>}
                  </div>

                  <button type="submit" className="btn btn-skybook w-100 mb-3" disabled={loading}>
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Creating Account…</>
                    ) : (
                      <><i className="bi bi-person-plus me-2"></i>Create Account</>
                    )}
                  </button>
                </form>

                <p className="text-center mb-0 small text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="fw-semibold">Sign In</Link>
                </p>

                <div className="mt-3 p-2 rounded small text-muted text-center" style={{ background: 'var(--skybook-gray-100)', fontSize: '0.7rem' }}>
                  <i className="bi bi-info-circle me-1"></i>
                  Demo-only account simulation. Not production-grade security.
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
