import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  const features = [
    { icon: 'bi-search', title: 'Smart Search', desc: 'Find the best flights with powerful search and filtering.' },
    { icon: 'bi-credit-card', title: 'Easy Booking', desc: 'Book flights in minutes with our streamlined process.' },
    { icon: 'bi-shield-check', title: 'Secure Payments', desc: 'Demo payment simulation with clear safety disclaimers.' },
    { icon: 'bi-ticket-perforated', title: 'E-Tickets', desc: 'Get printable e-tickets instantly after booking.' },
    { icon: 'bi-phone', title: 'Responsive Design', desc: 'Works beautifully on desktop, tablet, and mobile.' },
    { icon: 'bi-database', title: 'Local Persistence', desc: 'All data persists in browser Local Storage.' },
  ];

  const techStack = [
    { name: 'React.js', desc: 'UI library with functional components and hooks' },
    { name: 'JavaScript (ES6+)', desc: 'Modern JavaScript features' },
    { name: 'Bootstrap 5', desc: 'Responsive design framework' },
    { name: 'React Router DOM', desc: 'Client-side routing' },
    { name: 'Local Storage', desc: 'Client-side data persistence' },
    { name: 'CSS3', desc: 'Custom styling with animations' },
  ];

  return (
    <>
      <Navbar />
      {/* Hero */}
      <div className="text-white text-center py-5" style={{ background: 'var(--skybook-gradient)' }}>
        <div className="container py-3">
          <h1 className="fw-bold mb-3">About SkyBook</h1>
          <p className="lead opacity-75 mx-auto" style={{ maxWidth: 600 }}>
            An academic flight reservation system prototype demonstrating modern web development practices.
          </p>
        </div>
      </div>

      <div style={{ background: 'var(--skybook-gray-50)' }}>
        <div className="container py-5">
          {/* Disclaimer */}
          <div className="alert alert-info mb-5">
            <i className="bi bi-info-circle me-2"></i>
            <strong>Disclaimer:</strong> SkyBook is an academic project built for educational purposes.
            It is <strong>not</strong> a real airline, travel agency, or ticketing service. All flights,
            prices, bookings, and payments are simulated demo data.
          </div>

          {/* What is SkyBook */}
          <div className="row align-items-center mb-5 g-4">
            <div className="col-lg-6">
              <h2 className="fw-bold mb-3" style={{ color: 'var(--skybook-navy)' }}>What is SkyBook?</h2>
              <p className="text-muted">
                SkyBook is a complete, functional frontend application that simulates a real-world
                flight booking platform. It demonstrates end-to-end booking workflows including
                flight search, passenger details, payment simulation, ticket generation, and
                booking management.
              </p>
              <p className="text-muted">
                Built with React.js, Bootstrap 5, and browser Local Storage as the database,
                SkyBook showcases modern web development techniques including component-based
                architecture, context-based state management, and responsive design.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="skybook-card p-4 text-center" style={{ background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)' }}>
                <i className="bi bi-airplane-fill" style={{ fontSize: '4rem', color: 'var(--skybook-blue)' }}></i>
                <h4 className="fw-bold mt-3" style={{ color: 'var(--skybook-navy)' }}>SkyBook</h4>
                <p className="text-muted mb-0">Your Journey Begins Here</p>
              </div>
            </div>
          </div>

          {/* Mission */}
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3" style={{ color: 'var(--skybook-navy)' }}>Our Mission</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: 700 }}>
              To demonstrate how a professional-grade flight reservation system can be built
              using modern frontend technologies, providing a complete learning resource for
              web development students and enthusiasts.
            </p>
          </div>

          {/* Features */}
          <h2 className="fw-bold text-center mb-4" style={{ color: 'var(--skybook-navy)' }}>Key Features</h2>
          <div className="row g-4 mb-5">
            {features.map((f, i) => (
              <div className="col-md-6 col-lg-4" key={i}>
                <div className="skybook-card p-4 h-100 text-center">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{ width: 64, height: 64, background: 'var(--skybook-gray-100)' }}>
                    <i className={`bi ${f.icon} fs-3`} style={{ color: 'var(--skybook-blue)' }}></i>
                  </div>
                  <h5 className="fw-bold">{f.title}</h5>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Technology Stack */}
          <h2 className="fw-bold text-center mb-4" style={{ color: 'var(--skybook-navy)' }}>Technology Stack</h2>
          <div className="row g-3 mb-5 justify-content-center">
            {techStack.map((tech, i) => (
              <div className="col-md-4 col-lg-3" key={i}>
                <div className="skybook-card p-3 text-center h-100">
                  <h6 className="fw-bold" style={{ color: 'var(--skybook-blue)' }}>{tech.name}</h6>
                  <small className="text-muted">{tech.desc}</small>
                </div>
              </div>
            ))}
          </div>

          {/* Limitations */}
          <div className="skybook-card p-4 mb-5">
            <h4 className="fw-bold mb-3" style={{ color: 'var(--skybook-navy)' }}>
              <i className="bi bi-exclamation-triangle text-warning me-2"></i>Important Limitations
            </h4>
            <ul className="text-muted mb-0">
              <li>Local Storage is browser-specific and not a real shared database.</li>
              <li>Clearing browser data deletes all application data.</li>
              <li>Authentication is demo-only and not suitable for production.</li>
              <li>No real flight inventory, live prices, or actual ticket issuance.</li>
              <li>Payment simulation only — no real financial transactions.</li>
              <li>Multiple users on the same browser are not securely isolated.</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
