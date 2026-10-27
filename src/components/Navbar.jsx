import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * SkyBook professional airline-style navigation bar.
 * Deep navy background with white text and electric blue accents.
 */
export default function Navbar() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMenu = () => setCollapsed(true);

  const navLinkClass = ({ isActive }) =>
    `nav-link px-3 ${isActive ? 'active fw-semibold' : ''}`;

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark sticky-top"
      style={{
        backgroundColor: '#0a1628',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(37,99,235,0.15)',
        zIndex: 1050,
      }}
    >
      <div className="container">
        {/* ── Brand ──────────────────────────────────────────────── */}
        <Link
          className="navbar-brand d-flex align-items-center gap-2 fw-bold"
          to="/"
          onClick={closeMenu}
          style={{ fontSize: '1.4rem', letterSpacing: '-0.5px' }}
        >
          <i
            className="bi bi-airplane-fill"
            style={{ color: '#38bdf8', fontSize: '1.5rem', transform: 'rotate(-30deg)' }}
          ></i>
          <span>
            Sky<span style={{ color: '#38bdf8' }}>Book</span>
          </span>
        </Link>

        {/* ── Hamburger ─────────────────────────────────────────── */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          aria-controls="skybook-navbar"
          aria-expanded={!collapsed}
          aria-label="Toggle navigation"
          onClick={() => setCollapsed((c) => !c)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* ── Collapsible nav ───────────────────────────────────── */}
        <div
          className={`collapse navbar-collapse ${collapsed ? '' : 'show'}`}
          id="skybook-navbar"
        >
          {/* Left links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 mt-3 mt-lg-0">
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/" end onClick={closeMenu}>
                <i className="bi bi-house-door me-1"></i>Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/flights" onClick={closeMenu}>
                <i className="bi bi-search me-1"></i>Search Flights
              </NavLink>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink className={navLinkClass} to="/my-bookings" onClick={closeMenu}>
                  <i className="bi bi-journal-text me-1"></i>My Bookings
                </NavLink>
              </li>
            )}
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/offers" onClick={closeMenu}>
                <i className="bi bi-tag me-1"></i>Offers
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/about" onClick={closeMenu}>
                <i className="bi bi-info-circle me-1"></i>About Us
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/contact" onClick={closeMenu}>
                <i className="bi bi-envelope me-1"></i>Contact
              </NavLink>
            </li>
          </ul>

          {/* Right side */}
          <div className="d-flex align-items-center gap-2 mb-3 mb-lg-0">
            {isAuthenticated ? (
              /* ── Profile dropdown ─────────────────────────────── */
              <div className="dropdown">
                <button
                  className="btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    borderColor: 'rgba(255,255,255,0.25)',
                    borderRadius: '50px',
                    padding: '6px 16px',
                  }}
                >
                  <i className="bi bi-person-circle" style={{ fontSize: '1.15rem' }}></i>
                  <span className="d-none d-md-inline">
                    {currentUser?.firstName || 'User'}
                  </span>
                </button>

                <ul
                  className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2"
                  aria-labelledby="profileDropdown"
                  style={{ minWidth: '200px', borderRadius: '12px', overflow: 'hidden' }}
                >
                  <li className="px-3 py-2 border-bottom" style={{ backgroundColor: '#f8fafc' }}>
                    <div className="fw-semibold" style={{ color: '#0a1628' }}>
                      {currentUser?.firstName} {currentUser?.lastName}
                    </div>
                    <small className="text-muted">{currentUser?.email}</small>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item py-2"
                      to="/profile"
                      onClick={closeMenu}
                    >
                      <i className="bi bi-person me-2 text-primary"></i>My Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item py-2"
                      to="/my-bookings"
                      onClick={closeMenu}
                    >
                      <i className="bi bi-journal-bookmark me-2 text-primary"></i>My Bookings
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider my-1" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item py-2 text-danger"
                      onClick={() => {
                        closeMenu();
                        handleLogout();
                      }}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              /* ── Login / Sign Up ──────────────────────────────── */
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-light btn-sm"
                  onClick={closeMenu}
                  style={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    borderRadius: '50px',
                    padding: '6px 20px',
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-sm text-white"
                  onClick={closeMenu}
                  style={{
                    background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                    borderRadius: '50px',
                    padding: '6px 20px',
                    border: 'none',
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Inline custom styles for active links & hover */}
      <style>{`
        .navbar .nav-link {
          color: rgba(255,255,255,0.75) !important;
          transition: color 0.2s, background 0.2s;
          border-radius: 8px;
          font-size: 0.92rem;
        }
        .navbar .nav-link:hover,
        .navbar .nav-link.active {
          color: #fff !important;
          background: rgba(37,99,235,0.15);
        }
        .navbar .nav-link.active {
          background: rgba(37,99,235,0.25);
        }
        .dropdown-item:active {
          background-color: #2563eb !important;
          color: #fff !important;
        }
      `}</style>
    </nav>
  );
}
