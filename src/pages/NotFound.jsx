import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'var(--skybook-gradient)' }}>
      <div className="text-center text-white p-5">
        <div className="mb-4" style={{ fontSize: '6rem', lineHeight: 1 }}>
          <i className="bi bi-airplane-engines" style={{ opacity: 0.3 }}></i>
        </div>
        <h1 className="display-1 fw-bold mb-2" style={{ letterSpacing: '-2px' }}>404</h1>
        <h3 className="fw-semibold mb-3">Page Not Found</h3>
        <p className="opacity-75 mb-4 mx-auto" style={{ maxWidth: 400 }}>
          Oops! The page you're looking for seems to have taken off without us. 
          Let's get you back on course.
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <Link to="/" className="btn btn-light btn-lg fw-semibold">
            <i className="bi bi-house me-2"></i>Go Home
          </Link>
          <Link to="/flights" className="btn btn-outline-light btn-lg fw-semibold">
            <i className="bi bi-search me-2"></i>Search Flights
          </Link>
        </div>
      </div>
    </div>
  );
}
