import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FlightSearchForm from '../components/FlightSearchForm';
import { useBooking } from '../context/BookingContext';
import storageService from '../services/storageService';
import './Home.css';

const popularDestinations = [
  { city: 'Mumbai', code: 'BOM', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', price: 2499 },
  { city: 'Delhi', code: 'DEL', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', price: 2299 },
  { city: 'Bangalore', code: 'BLR', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', price: 2899 },
  { city: 'Goa', code: 'GOX', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', price: 3199 },
  { city: 'Kolkata', code: 'CCU', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', price: 3499 },
  { city: 'Chennai', code: 'MAA', color: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', price: 2699 },
];

const featuredDeals = [
  { from: 'Mumbai', fromCode: 'BOM', to: 'Delhi', toCode: 'DEL', price: 1999, originalPrice: 3499, discount: 43, airline: 'Air India' },
  { from: 'Bangalore', fromCode: 'BLR', to: 'Goa', toCode: 'GOX', price: 2499, originalPrice: 4199, discount: 40, airline: 'IndiGo' },
  { from: 'Delhi', fromCode: 'DEL', to: 'Kolkata', toCode: 'CCU', price: 2799, originalPrice: 4599, discount: 39, airline: 'SpiceJet' },
];

const features = [
  { icon: 'bi-currency-rupee', title: 'Best Prices', desc: 'Guaranteed lowest fares with price match promise across all major airlines.' },
  { icon: 'bi-calendar-check', title: 'Easy Booking', desc: 'Book your flights in under 2 minutes with our streamlined booking process.' },
  { icon: 'bi-headset', title: '24/7 Support', desc: 'Round-the-clock customer support to assist you with any travel needs.' },
  { icon: 'bi-shield-check', title: 'Secure Payments', desc: 'Your transactions are protected with industry-standard encryption.' },
];

const testimonials = [
  { name: 'Priya Sharma', quote: 'SkyBook made my travel planning so much easier. The interface is clean and booking was seamless!', rating: 5, initials: 'PS', color: '#667eea' },
  { name: 'Rahul Verma', quote: 'Best flight booking platform I\'ve used. Found amazing deals that saved me over ₹3000 on my trip.', rating: 5, initials: 'RV', color: '#f5576c' },
  { name: 'Anita Desai', quote: 'The booking process is incredibly smooth. I love how I can compare prices across airlines easily.', rating: 4, initials: 'AD', color: '#43e97b' },
];

const statsData = [
  { target: 500, suffix: '+', label: 'Routes', icon: 'bi-signpost-2' },
  { target: 50, suffix: 'K+', label: 'Happy Travelers', icon: 'bi-people' },
  { target: 20, suffix: '+', label: 'Airlines', icon: 'bi-airplane' },
  { target: 99.9, suffix: '%', label: 'Uptime', icon: 'bi-graph-up-arrow' },
];

function AnimatedCounter({ target, suffix, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const isDecimal = target % 1 !== 0;
          const increment = target / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(isDecimal ? parseFloat(start.toFixed(1)) : Math.floor(start));
            }
          }, 16);
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Home() {
  const navigate = useNavigate();
  const { setSearchParams } = useBooking();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subError, setSubError] = useState('');

  const handleExplore = (dest) => {
    const originCode = dest.code === 'DEL' ? 'BOM' : 'DEL';
    setSearchParams({
      tripType: 'one-way',
      origin: originCode,
      destination: dest.code,
      departureDate: new Date().toISOString().split('T')[0],
      departDate: new Date().toISOString().split('T')[0],
      adults: 1,
      children: 0,
      infants: 0,
      cabinClass: 'Economy',
    });
    navigate('/flights');
  };

  const handleBookDeal = (deal) => {
    setSearchParams({
      tripType: 'one-way',
      origin: deal.fromCode,
      destination: deal.toCode,
      departureDate: new Date().toISOString().split('T')[0],
      departDate: new Date().toISOString().split('T')[0],
      adults: 1,
      children: 0,
      infants: 0,
      cabinClass: 'Economy',
    });
    navigate('/flights');
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubError('');
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setSubError('Please enter a valid email address.');
      return;
    }
    const existing = storageService.getItem('skybook_newsletter') || [];
    if (existing.includes(email)) {
      setSubError('This email is already subscribed.');
      return;
    }
    existing.push(email);
    storageService.setItem('skybook_newsletter', existing);
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <div className="skybook-home">
      <Navbar />

      {/* Hero Section */}
      <section className="skybook-hero">
        <div className="skybook-hero-bg"></div>
        <div className="skybook-hero-airplane">
          <i className="bi bi-airplane"></i>
        </div>
        <div className="skybook-hero-airplane skybook-hero-airplane-2">
          <i className="bi bi-airplane"></i>
        </div>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="skybook-hero-title display-3 fw-bold text-white mb-3">
                Your Journey <span className="skybook-text-gradient">Begins Here</span>
              </h1>
              <p className="skybook-hero-subtitle lead text-white-50 mb-5">
                Discover destinations, compare fares, and book your next flight with ease.
              </p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="skybook-search-glass p-4 rounded-4">
                <FlightSearchForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="skybook-destinations py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2">Popular Destinations</h2>
            <p className="text-muted">Explore trending routes with the best fares</p>
          </div>
          <div className="row g-4">
            {popularDestinations.map((dest) => (
              <div key={dest.code} className="col-sm-6 col-md-4 col-lg-2">
                <div className="card skybook-dest-card h-100 border-0 shadow-sm overflow-hidden">
                  <div
                    className="skybook-dest-img d-flex align-items-center justify-content-center"
                    style={{ background: dest.color, height: '140px' }}
                  >
                    <span className="fs-1 fw-bold text-white" style={{ opacity: 0.8 }}>{dest.code}</span>
                  </div>
                  <div className="card-body text-center p-3">
                    <h6 className="fw-bold mb-1">{dest.city}</h6>
                    <p className="text-muted small mb-2">Starting from <span className="fw-bold text-primary">₹{dest.price.toLocaleString('en-IN')}</span></p>
                    <button
                      className="btn btn-sm btn-outline-primary rounded-pill px-3"
                      onClick={() => handleExplore(dest)}
                    >
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="skybook-deals py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2">Featured Deals</h2>
            <p className="text-muted">Grab these exclusive offers before they expire</p>
          </div>
          <div className="row g-4">
            {featuredDeals.map((deal, idx) => (
              <div key={idx} className="col-md-4">
                <div className="card skybook-deal-card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className="badge bg-danger rounded-pill px-3 py-2">{deal.discount}% OFF</span>
                      <span className="text-muted small">{deal.airline}</span>
                    </div>
                    <h5 className="fw-bold mb-1">
                      {deal.from} <i className="bi bi-arrow-right mx-2 text-primary"></i> {deal.to}
                    </h5>
                    <p className="text-muted small mb-3">One way · Economy</p>
                    <div className="d-flex align-items-baseline gap-2 mb-3">
                      <span className="fs-4 fw-bold text-primary">₹{deal.price.toLocaleString('en-IN')}</span>
                      <span className="text-decoration-line-through text-muted">₹{deal.originalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <button
                      className="btn btn-primary w-100 rounded-pill"
                      onClick={() => handleBookDeal(deal)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose SkyBook */}
      <section className="skybook-features py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2">Why Choose SkyBook?</h2>
            <p className="text-muted">We make your travel planning experience seamless</p>
          </div>
          <div className="row g-4">
            {features.map((feature, idx) => (
              <div key={idx} className="col-sm-6 col-lg-3">
                <div className="card skybook-feature-card border-0 shadow-sm h-100 text-center p-4">
                  <div className="card-body">
                    <div className="skybook-feature-icon mb-3 mx-auto">
                      <i className={`bi ${feature.icon} fs-2 text-primary`}></i>
                    </div>
                    <h5 className="fw-bold mb-2">{feature.title}</h5>
                    <p className="text-muted small mb-0">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="skybook-stats py-5">
        <div className="skybook-stats-bg"></div>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row g-4 text-center">
            {statsData.map((stat, idx) => (
              <div key={idx} className="col-6 col-md-3">
                <div className="skybook-stat-item p-3">
                  <i className={`bi ${stat.icon} fs-3 text-white mb-2 d-block`}></i>
                  <h2 className="fw-bold text-white mb-1">
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  </h2>
                  <p className="text-white-50 mb-0">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="skybook-testimonials py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2">What Our Travelers Say</h2>
            <p className="text-muted">Real experiences from real travelers</p>
          </div>
          <div className="row g-4">
            {testimonials.map((t, idx) => (
              <div key={idx} className="col-md-4">
                <div className="card skybook-testimonial-card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div
                        className="skybook-avatar rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                        style={{ width: '48px', height: '48px', background: t.color, color: '#fff', fontWeight: 600 }}
                      >
                        {t.initials}
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0">{t.name}</h6>
                        <div className="text-warning small">
                          {Array.from({ length: 5 }, (_, i) => (
                            <i key={i} className={`bi ${i < t.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted mb-0 fst-italic">&ldquo;{t.quote}&rdquo;</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="skybook-newsletter py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center">
              <h2 className="fw-bold text-white mb-2">Stay in the Loop</h2>
              <p className="text-white-50 mb-4">Subscribe to get exclusive deals and travel updates straight to your inbox.</p>
              {subscribed && (
                <div className="alert alert-success d-inline-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill"></i> Thank you for subscribing!
                </div>
              )}
              <form onSubmit={handleSubscribe} className="d-flex gap-2 justify-content-center">
                <input
                  type="email"
                  className="form-control form-control-lg rounded-pill"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ maxWidth: '350px' }}
                />
                <button type="submit" className="btn btn-light btn-lg rounded-pill px-4 fw-semibold">
                  Subscribe
                </button>
              </form>
              {subError && <p className="text-warning small mt-2">{subError}</p>}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
