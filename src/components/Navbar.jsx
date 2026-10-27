import { useState, useRef, useEffect } from 'react';
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
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMenu = () => {
    setCollapsed(true);
    setProfileOpen(false);
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Close profile dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setProfileOpen(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const userInitials = (
    (currentUser?.firstName?.[0] || '') + (currentUser?.lastName?.[0] || '')
  ).toUpperCase() || 'U';

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

        {/* ── Right side: Profile Dropdown + Mobile Toggler (ALWAYS in right corner) ── */}
        <div className="d-flex align-items-center gap-2 order-lg-3 ms-auto ms-lg-0">
          {isAuthenticated ? (
            /* ── Professional Profile dropdown ────────────────── */
            <div className="position-relative" ref={profileRef} style={{ zIndex: 1150 }}>
              <button
                type="button"
                id="profileDropdownBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpen((prev) => !prev);
                }}
                className="btn d-flex align-items-center gap-2 border-0 shadow-none text-start p-1 pe-3"
                style={{
                  background: profileOpen ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '50px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                }}
                aria-expanded={profileOpen}
              >
                {/* Avatar circle */}
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                  style={{
                    width: 32,
                    height: 32,
                    background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                    fontSize: '0.8rem',
                    letterSpacing: '0.5px',
                    flexShrink: 0,
                  }}
                >
                  {userInitials}
                </div>

                {/* Name */}
                <span className="fw-semibold text-white small d-none d-sm-inline">
                  {currentUser?.firstName || 'Account'}
                </span>

                {/* Animated Chevron */}
                <i
                  className="bi bi-chevron-down text-white-50"
                  style={{
                    fontSize: '0.72rem',
                    transition: 'transform 0.2s ease',
                    transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                ></i>
              </button>

              {/* Floating Dropdown Card — Pure absolute, no scrollbar */}
              {profileOpen && (
                <div
                  className="skybook-profile-card shadow-lg"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 10px)',
                    width: '280px',
                    maxWidth: 'calc(100vw - 24px)',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    zIndex: 99999,
                    boxShadow: '0 20px 45px -10px rgba(10, 22, 40, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.08)',
                    animation: 'skybookDropdownIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  }}
                >
                  {/* User Info Header */}
                  <div
                    className="p-3 text-white"
                    style={{
                      background: 'linear-gradient(135deg, #0a1628, #1e3a5f)',
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow"
                        style={{
                          width: 44,
                          height: 44,
                          background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
                          fontSize: '1rem',
                          flexShrink: 0,
                        }}
                      >
                        {userInitials}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div className="fw-bold text-truncate" style={{ fontSize: '0.95rem' }}>
                          {currentUser?.firstName} {currentUser?.lastName}
                        </div>
                        <small className="text-white-50 text-truncate d-block" style={{ fontSize: '0.78rem' }}>
                          {currentUser?.email || 'demo@skybook.com'}
                        </small>
                        <span
                          className="badge mt-1 text-white"
                          style={{
                            backgroundColor: 'rgba(56, 189, 248, 0.25)',
                            fontSize: '0.68rem',
                            border: '1px solid rgba(56, 189, 248, 0.4)',
                          }}
                        >
                          <i className="bi bi-shield-check me-1"></i>Verified Demo User
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Actions */}
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="skybook-dropdown-action"
                      onClick={() => {
                        setProfileOpen(false);
                        closeMenu();
                      }}
                    >
                      <div
                        className="skybook-action-icon rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: 34, height: 34, background: '#eff6ff', color: '#2563eb', flexShrink: 0 }}
                      >
                        <i className="bi bi-person-fill fs-6"></i>
                      </div>
                      <div>
                        <div className="fw-semibold small text-dark">My Profile</div>
                        <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
                          Personal info & preferences
                        </small>
                      </div>
                    </Link>

                    <Link
                      to="/my-bookings"
                      className="skybook-dropdown-action"
                      onClick={() => {
                        setProfileOpen(false);
                        closeMenu();
                      }}
                    >
                      <div
                        className="skybook-action-icon rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: 34, height: 34, background: '#f0fdf4', color: '#16a34a', flexShrink: 0 }}
                      >
                        <i className="bi bi-ticket-perforated-fill fs-6"></i>
                      </div>
                      <div>
                        <div className="fw-semibold small text-dark">My Bookings</div>
                        <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
                          Manage tickets & itineraries
                        </small>
                      </div>
                    </Link>

                    <Link
                      to="/offers"
                      className="skybook-dropdown-action"
                      onClick={() => {
                        setProfileOpen(false);
                        closeMenu();
                      }}
                    >
                      <div
                        className="skybook-action-icon rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: 34, height: 34, background: '#fef3c7', color: '#d97706', flexShrink: 0 }}
                      >
                        <i className="bi bi-tag-fill fs-6"></i>
                      </div>
                      <div>
                        <div className="fw-semibold small text-dark">Offers & Deals</div>
                        <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
                          Explore travel discounts
                        </small>
                      </div>
                    </Link>
                  </div>

                  <div className="border-top" style={{ borderColor: '#f1f5f9' }}></div>

                  {/* Logout Button */}
                  <div className="p-2">
                    <button
                      type="button"
                      className="skybook-dropdown-action skybook-logout-btn w-100 border-0 bg-transparent text-start"
                      onClick={() => {
                        setProfileOpen(false);
                        closeMenu();
                        handleLogout();
                      }}
                    >
                      <div
                        className="skybook-action-icon rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: 34, height: 34, background: '#fee2e2', color: '#dc2626', flexShrink: 0 }}
                      >
                        <i className="bi bi-box-arrow-right fs-6"></i>
                      </div>
                      <div>
                        <div className="fw-semibold small text-danger">Sign Out</div>
                        <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
                          End current demo session
                        </small>
                      </div>
                    </button>
                  </div>
                </div>
              )}
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
                  padding: '6px 16px',
                }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn btn-sm text-white d-none d-sm-inline-block"
                onClick={closeMenu}
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                  borderRadius: '50px',
                  padding: '6px 16px',
                  border: 'none',
                }}
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Hamburger toggle for mobile navigation */}
          <button
            className="navbar-toggler border-0 shadow-none ms-1"
            type="button"
            aria-controls="skybook-navbar"
            aria-expanded={!collapsed}
            aria-label="Toggle navigation"
            onClick={() => {
              setCollapsed((c) => !c);
              setProfileOpen(false);
            }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* ── Collapsible nav (Links only) ─────────────────────────── */}
        <div
          className={`collapse navbar-collapse order-lg-2 ${collapsed ? '' : 'show'}`}
          id="skybook-navbar"
        >
          {/* Nav links */}
          <ul className="navbar-nav ms-lg-4 me-auto mb-2 mb-lg-0 mt-3 mt-lg-0">
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
        </div>
      </div>

      {/* Inline custom styles for active links, hover & profile menu */}
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
        @keyframes skybookDropdownIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .skybook-dropdown-action {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          margin: 2px 8px;
          border-radius: 12px;
          text-decoration: none;
          transition: background-color 0.15s ease, transform 0.15s ease;
        }
        .skybook-dropdown-action:hover {
          background-color: #f1f5f9;
          transform: translateX(3px);
        }
        .skybook-dropdown-action:hover .skybook-action-icon {
          transform: scale(1.08);
        }
        .skybook-action-icon {
          transition: transform 0.15s ease;
        }
        .skybook-profile-card {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .skybook-profile-card::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        .skybook-logout-btn:hover {
          background-color: #fef2f2 !important;
        }
      `}</style>
    </nav>
  );
}
