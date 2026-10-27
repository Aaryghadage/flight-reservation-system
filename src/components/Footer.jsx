import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * SkyBook professional footer.
 * Dark navy background with 4 columns, newsletter, and demo disclaimer.
 */
export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    try {
      const existing = JSON.parse(localStorage.getItem('skybook_newsletter') || '[]');
      if (!existing.includes(email.toLowerCase())) {
        existing.push(email.toLowerCase());
        localStorage.setItem('skybook_newsletter', JSON.stringify(existing));
      }
    } catch {
      localStorage.setItem('skybook_newsletter', JSON.stringify([email.toLowerCase()]));
    }

    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer
      style={{
        backgroundColor: '#0a1628',
        color: 'rgba(255,255,255,0.8)',
        paddingTop: '3.5rem',
        paddingBottom: '1.5rem',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div className="row g-4 mb-4">
          {/* ── Column 1: About ──────────────────────────────────── */}
          <div className="col-lg-3 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <i
                className="bi bi-airplane-fill"
                style={{ color: '#38bdf8', fontSize: '1.4rem', transform: 'rotate(-30deg)' }}
              ></i>
              <h5 className="mb-0 fw-bold text-white" style={{ letterSpacing: '-0.5px' }}>
                Sky<span style={{ color: '#38bdf8' }}>Book</span>
              </h5>
            </div>
            <p className="small" style={{ lineHeight: 1.7 }}>
              SkyBook is a demo flight reservation system built as an academic
              project. Search flights, manage bookings, and explore a realistic
              airline booking experience.
            </p>
            {/* Social icons */}
            <div className="d-flex gap-3 mt-3">
              {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map((s) => (
                <a
                  key={s}
                  href="#!"
                  className="text-decoration-none"
                  title={s}
                  style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                >
                  <i className={`bi bi-${s}`} style={{ fontSize: '1.15rem' }}></i>
                </a>
              ))}
            </div>
          </div>

          {/* ── Column 2: Quick Links ────────────────────────────── */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-semibold mb-3">Quick Links</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/flights', label: 'Search Flights' },
                { to: '/offers', label: 'Offers' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-decoration-none"
                    style={{ color: 'rgba(255,255,255,0.65)', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')
                    }
                  >
                    <i className="bi bi-chevron-right me-1" style={{ fontSize: '0.7rem' }}></i>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Support ─────────────────────────────────── */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-semibold mb-3">Support</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              {[
                { icon: 'bi-question-circle', label: 'FAQs' },
                { icon: 'bi-shield-check', label: 'Privacy Policy' },
                { icon: 'bi-file-text', label: 'Terms & Conditions' },
                { icon: 'bi-arrow-repeat', label: 'Cancellation Policy' },
                { icon: 'bi-chat-dots', label: 'Help Center' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href="#!"
                    className="text-decoration-none"
                    style={{ color: 'rgba(255,255,255,0.65)', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')
                    }
                  >
                    <i className={`bi ${item.icon} me-2`}></i>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Contact & Newsletter ───────────────────── */}
          <div className="col-lg-4 col-md-6">
            <h6 className="text-white fw-semibold mb-3">Contact Info</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-4">
              <li>
                <i className="bi bi-geo-alt-fill me-2" style={{ color: '#38bdf8' }}></i>
                123 Aviation Avenue, New Delhi, India
              </li>
              <li>
                <i className="bi bi-telephone-fill me-2" style={{ color: '#38bdf8' }}></i>
                +91 98765 43210 (Demo)
              </li>
              <li>
                <i className="bi bi-envelope-fill me-2" style={{ color: '#38bdf8' }}></i>
                support@skybook.demo
              </li>
              <li>
                <i className="bi bi-clock-fill me-2" style={{ color: '#38bdf8' }}></i>
                24/7 Customer Support (Demo)
              </li>
            </ul>

            {/* Newsletter */}
            <h6 className="text-white fw-semibold mb-2">Newsletter</h6>
            <p className="small mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Subscribe for demo flight deals & updates.
            </p>
            <form onSubmit={handleNewsletter} className="d-flex gap-2">
              <input
                type="email"
                className="form-control form-control-sm bg-dark border-secondary text-white"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ borderRadius: '8px' }}
              />
              <button
                type="submit"
                className="btn btn-sm text-white flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                  borderRadius: '8px',
                  border: 'none',
                  padding: '6px 16px',
                }}
              >
                <i className="bi bi-send"></i>
              </button>
            </form>
            {subscribed && (
              <div className="text-success small mt-2">
                <i className="bi bi-check-circle me-1"></i>Subscribed successfully!
              </div>
            )}
          </div>
        </div>

        {/* ── Divider & bottom ────────────────────────────────────── */}
        <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.5)' }}>
            © 2026 SkyBook. Academic Project — Not a real airline.
          </p>
          <p
            className="small mb-0 text-center"
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.78rem',
            }}
          >
            <i className="bi bi-info-circle me-1"></i>
            This is a demo application. No real flights, payments, or bookings are
            processed.
          </p>
        </div>
      </div>
    </footer>
  );
}
