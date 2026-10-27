import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { sampleCoupons } from '../data/coupons';

export default function Offers() {
  const [category, setCategory] = useState('all');
  const [copied, setCopied] = useState(null);

  const categories = ['all', 'domestic', 'international', 'first-time'];

  const filtered = sampleCoupons.filter((c) => {
    if (category === 'all') return c.isActive;
    if (category === 'first-time') return c.isActive && (c.code || '').toLowerCase().includes('first') || (c.code || '').toLowerCase().includes('welcome');
    return c.isActive && (c.applicableRoutes || 'all') === category || (category === 'all');
  }).filter(c => c.isActive);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(code);
      setTimeout(() => setCopied(null), 2000);
    }).catch(() => {
      setCopied(code);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <>
      <Navbar />
      {/* Hero */}
      <div className="text-white text-center py-5" style={{ background: 'var(--skybook-gradient)' }}>
        <div className="container">
          <h2 className="fw-bold mb-2"><i className="bi bi-tags me-2"></i>Exclusive Offers & Deals</h2>
          <p className="opacity-75">Save big on your next flight with these amazing offers!</p>
          <p className="small opacity-50">All offers are sample promotional data for demonstration only.</p>
        </div>
      </div>

      <div style={{ background: 'var(--skybook-gray-50)', minHeight: '60vh' }}>
        <div className="container py-5">
          {/* Promo Banner */}
          <div className="skybook-card p-4 mb-5 text-center" style={{ background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)' }}>
            <h4 className="fw-bold" style={{ color: 'var(--skybook-navy)' }}>🎉 Season Sale is Live!</h4>
            <p className="text-muted mb-0">Get up to 25% off on domestic and international flights. Use code <strong>SUMMER25</strong></p>
          </div>

          {/* Category Filter */}
          <div className="d-flex justify-content-center mb-4 flex-wrap gap-2">
            {categories.map((cat) => (
              <button key={cat} className={`btn ${category === cat ? 'btn-skybook' : 'btn-skybook-outline'} text-capitalize`}
                onClick={() => setCategory(cat)}>
                {cat === 'first-time' ? 'First-Time Users' : cat}
              </button>
            ))}
          </div>

          {/* Offer Cards */}
          <div className="row g-4">
            {filtered.map((coupon, i) => (
              <div className="col-md-6 col-lg-4" key={i}>
                <div className="skybook-card h-100">
                  {/* Discount Badge */}
                  <div className="p-3 text-white text-center" style={{
                    background: i % 3 === 0 ? 'var(--skybook-gradient)' :
                      i % 3 === 1 ? 'linear-gradient(135deg, #059669, #34d399)' :
                        'linear-gradient(135deg, #7c3aed, #a78bfa)'
                  }}>
                    <h3 className="fw-bold mb-0">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                    </h3>
                    {coupon.maxDiscount && (
                      <small className="opacity-75">Up to ₹{coupon.maxDiscount.toLocaleString('en-IN')}</small>
                    )}
                  </div>

                  <div className="p-4">
                    {/* Code */}
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span className="font-monospace fw-bold px-3 py-2 rounded"
                        style={{ background: 'var(--skybook-gray-100)', border: '2px dashed var(--skybook-blue)', color: 'var(--skybook-blue)', letterSpacing: 2 }}>
                        {coupon.code}
                      </span>
                      <button className={`btn btn-sm ${copied === coupon.code ? 'btn-success' : 'btn-skybook-outline'}`}
                        onClick={() => handleCopy(coupon.code)}>
                        <i className={`bi ${copied === coupon.code ? 'bi-check-lg' : 'bi-clipboard'} me-1`}></i>
                        {copied === coupon.code ? 'Copied!' : 'Copy'}
                      </button>
                    </div>

                    <p className="fw-semibold mb-2">{coupon.description}</p>

                    <ul className="list-unstyled small text-muted mb-3">
                      <li><i className="bi bi-check2 text-success me-1"></i>Min. booking: ₹{(coupon.minBookingAmount || 0).toLocaleString('en-IN')}</li>
                      <li><i className="bi bi-check2 text-success me-1"></i>Routes: {(coupon.applicableRoutes || 'All').charAt(0).toUpperCase() + (coupon.applicableRoutes || 'all').slice(1)}</li>
                      <li><i className="bi bi-calendar me-1"></i>Valid: {coupon.validFrom} to {coupon.validTo}</li>
                    </ul>

                    <span className="badge bg-light text-dark small">
                      <i className="bi bi-info-circle me-1"></i>Sample offer
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-tag fs-1 text-muted d-block mb-3"></i>
              <h5 className="text-muted">No offers available in this category</h5>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
