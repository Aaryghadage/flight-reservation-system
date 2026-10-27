import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingSummary from '../components/BookingSummary';
import EmptyState from '../components/EmptyState';
import { getFlightById } from '../services/flightService';
import { calculateFare, getClassMultiplier } from '../utils/pricing';

export default function FlightDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { searchParams, selectFlight, selectedFlight, setSearchParams } = useBooking();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [selectedCabin, setSelectedCabin] = useState(
    searchParams?.cabinClass || 'Economy'
  );

  useEffect(() => {
    setTimeout(() => {
      const f = getFlightById(id);
      if (f) {
        const initialCabin = searchParams?.cabinClass || f.cabinClass || 'Economy';
        const mult = getClassMultiplier(initialCabin);
        const basePrice = f.basePrice || f.price;
        const baseMult = getClassMultiplier(f.baseCabinClass || 'Economy') || 1;
        const price = Math.round(basePrice * (mult / baseMult));
        const updated = {
          ...f,
          basePrice,
          baseCabinClass: f.baseCabinClass || 'Economy',
          cabinClass: initialCabin,
          price,
          childPrice: Math.round(price * 0.75),
          infantPrice: Math.round(price * 0.1),
        };
        setFlight(updated);
        setSelectedCabin(initialCabin);
        selectFlight(updated);
      }
      setLoading(false);
    }, 400);
  }, [id, searchParams?.cabinClass]);

  const activeParams = searchParams
    ? { ...searchParams, cabinClass: selectedCabin || searchParams.cabinClass || 'Economy' }
    : (flight ? {
        tripType: 'one-way',
        origin: flight.origin?.code || flight.origin?.city || 'BOM',
        destination: flight.destination?.code || flight.destination?.city || 'DEL',
        departureDate: new Date().toISOString().split('T')[0],
        departDate: new Date().toISOString().split('T')[0],
        adults: 1,
        children: 0,
        infants: 0,
        cabinClass: selectedCabin || flight.cabinClass || 'Economy',
      } : null);

  const fare = flight && activeParams ? calculateFare(flight, activeParams) : null;

  const handleCabinChange = (newCabin) => {
    setSelectedCabin(newCabin);
    if (flight) {
      const mult = getClassMultiplier(newCabin);
      const basePrice = flight.basePrice || flight.price;
      const baseMult = getClassMultiplier(flight.baseCabinClass || 'Economy') || 1;
      const price = Math.round(basePrice * (mult / baseMult));
      const updated = {
        ...flight,
        basePrice,
        baseCabinClass: flight.baseCabinClass || 'Economy',
        cabinClass: newCabin,
        price,
        childPrice: Math.round(price * 0.75),
        infantPrice: Math.round(price * 0.1),
      };
      setFlight(updated);
      selectFlight(updated);
      const updatedParams = {
        ...(searchParams || {
          tripType: 'one-way',
          origin: flight.origin?.code || flight.origin?.city || 'BOM',
          destination: flight.destination?.code || flight.destination?.city || 'DEL',
          departureDate: new Date().toISOString().split('T')[0],
          departDate: new Date().toISOString().split('T')[0],
          adults: 1,
          children: 0,
          infants: 0,
        }),
        cabinClass: newCabin,
      };
      setSearchParams(updatedParams);
    }
  };

  const handleContinueBooking = () => {
    if (flight) {
      selectFlight(flight);
      if (!searchParams && activeParams) {
        setSearchParams(activeParams);
      }
      navigate('/passenger-details');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container py-5">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 text-muted">Loading flight details…</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!flight) {
    return (
      <>
        <Navbar />
        <div className="container py-5">
          <EmptyState
            icon="bi-airplane-engines"
            title="Flight Not Found"
            message="The flight you're looking for doesn't exist or is no longer available."
            actionText="Back to Search"
            onAction={() => navigate('/flights')}
          />
        </div>
        <Footer />
      </>
    );
  }

  const cabinBadgeClass = {
    'Economy': 'badge-economy',
    'Premium Economy': 'badge-premium',
    'Business': 'badge-business',
    'First Class': 'badge-first',
  }[flight.cabinClass] || 'badge-economy';

  const originCode = typeof flight.origin === 'object' && flight.origin !== null ? (flight.origin.code || '') : (flight.origin || '');
  const originCity = typeof flight.origin === 'object' && flight.origin !== null ? (flight.origin.city || '') : (flight.originCity || originCode);
  const originAirport = typeof flight.origin === 'object' && flight.origin !== null ? (flight.origin.airport || '') : `${originCity} Airport`;

  const destCode = typeof flight.destination === 'object' && flight.destination !== null ? (flight.destination.code || '') : (flight.destination || '');
  const destCity = typeof flight.destination === 'object' && flight.destination !== null ? (flight.destination.city || '') : (flight.destinationCity || destCode);
  const destAirport = typeof flight.destination === 'object' && flight.destination !== null ? (flight.destination.airport || '') : `${destCity} Airport`;

  return (
    <>
      <Navbar />
      <div style={{ background: 'var(--skybook-gray-50)', minHeight: '80vh' }}>
        {/* Breadcrumb */}
        <div className="container pt-4">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/flights">Flights</Link></li>
              <li className="breadcrumb-item active">{flight.flightNumber}</li>
            </ol>
          </nav>
        </div>

        <div className="container pb-5">
          <div className="row g-4">
            {/* Main Content */}
            <div className="col-lg-8">
              {/* Flight Header Card */}
              <div className="skybook-card p-4 mb-4">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                      style={{ width: 50, height: 50, background: 'var(--skybook-gradient)', fontSize: '0.85rem' }}>
                      {flight.airlineLogo || (flight.airline ? flight.airline.substring(0, 2) : 'SB')}
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold">{flight.airline}</h5>
                      <span className="text-muted small">{flight.flightNumber} · {flight.aircraft}</span>
                    </div>
                  </div>
                  <span className={`badge ${cabinBadgeClass} px-3 py-2 fs-6`}>{flight.cabinClass}</span>
                </div>

                {/* Interactive Cabin Class Selector */}
                <div className="p-3 mb-4 rounded-3" style={{ background: '#f0f7ff', border: '1px solid #bfdbfe' }}>
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div>
                      <span className="fw-bold small d-block" style={{ color: '#1e3a5f' }}>
                        <i className="bi bi-award-fill me-1 text-primary"></i>Upgrade or Change Cabin Class:
                      </span>
                      <small className="text-muted" style={{ fontSize: '0.78rem' }}>
                        Prices adjust automatically based on the class multiplier
                      </small>
                    </div>
                    <div className="btn-group" role="group">
                      {[
                        { name: 'Economy', mult: '1x' },
                        { name: 'Premium Economy', mult: '1.5x' },
                        { name: 'Business', mult: '2.5x' },
                        { name: 'First Class', mult: '4x' },
                      ].map((cls) => (
                        <button
                          key={cls.name}
                          type="button"
                          className={`btn btn-sm ${
                            selectedCabin === cls.name
                              ? 'btn-primary fw-bold shadow-sm'
                              : 'btn-outline-primary bg-white'
                          }`}
                          onClick={() => handleCabinChange(cls.name)}
                          style={{ fontSize: '0.82rem' }}
                        >
                          {cls.name} <span className="badge bg-light text-dark ms-1" style={{ fontSize: '0.68rem' }}>{cls.mult}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Visual Flight Path */}
                <div className="row align-items-center text-center py-3"
                  style={{ background: 'var(--skybook-gray-50)', borderRadius: 'var(--skybook-radius)' }}>
                  <div className="col-4">
                    <h3 className="fw-bold mb-0" style={{ color: 'var(--skybook-navy)' }}>{flight.departureTime}</h3>
                    <p className="fw-semibold mb-0">{originCode}</p>
                    <small className="text-muted">{originCity}</small>
                    <br />
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>{originAirport}</small>
                  </div>
                  <div className="col-4">
                    <small className="text-muted d-block mb-1">{flight.duration}</small>
                    <div className="position-relative mx-3">
                      <hr style={{ borderTop: '2px dashed var(--skybook-blue)', opacity: 0.5 }} />
                      <i className="bi bi-airplane-fill position-absolute top-50 start-50 translate-middle"
                        style={{ color: 'var(--skybook-blue)', fontSize: '1.2rem' }}></i>
                    </div>
                    <span className={`badge ${flight.stops === 0 ? 'bg-success' : 'bg-warning text-dark'} mt-1`}>
                      {flight.stops === 0 ? 'Nonstop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                    </span>
                  </div>
                  <div className="col-4">
                    <h3 className="fw-bold mb-0" style={{ color: 'var(--skybook-navy)' }}>{flight.arrivalTime}</h3>
                    <p className="fw-semibold mb-0">{destCode}</p>
                    <small className="text-muted">{destCity}</small>
                    <br />
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>{destAirport}</small>
                  </div>
                </div>

                {/* Stops detail */}
                {flight.stopDetails && flight.stopDetails.length > 0 && (
                  <div className="mt-3 p-3 rounded" style={{ background: '#fffbeb' }}>
                    <p className="fw-semibold small mb-1"><i className="bi bi-geo-alt me-1"></i>Layover Details</p>
                    {flight.stopDetails.map((stop, i) => (
                      <small key={i} className="d-block text-muted">
                        {stop.city} ({stop.code}) — {stop.duration} layover
                      </small>
                    ))}
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="skybook-card">
                <ul className="nav nav-tabs px-3 pt-3">
                  {[
                    { key: 'info', label: 'Flight Info', icon: 'bi-info-circle' },
                    { key: 'baggage', label: 'Baggage', icon: 'bi-luggage' },
                    { key: 'fare', label: 'Fare Rules', icon: 'bi-receipt' },
                    { key: 'amenities', label: 'Amenities', icon: 'bi-stars' },
                  ].map((tab) => (
                    <li className="nav-item" key={tab.key}>
                      <button
                        className={`nav-link ${activeTab === tab.key ? 'active fw-semibold' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                      >
                        <i className={`bi ${tab.icon} me-1`}></i>{tab.label}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="p-4">
                  {activeTab === 'info' && (
                    <div className="row g-3">
                      {[
                        { label: 'Airline', value: flight.airline, icon: 'bi-building' },
                        { label: 'Flight Number', value: flight.flightNumber, icon: 'bi-hash' },
                        { label: 'Aircraft', value: flight.aircraft, icon: 'bi-airplane' },
                        { label: 'Duration', value: flight.duration, icon: 'bi-clock' },
                        { label: 'Cabin Class', value: flight.cabinClass, icon: 'bi-star' },
                        { label: 'Available Seats', value: flight.seatsAvailable, icon: 'bi-person' },
                      ].map((item, i) => (
                        <div className="col-md-6" key={i}>
                          <div className="d-flex align-items-center gap-3 p-3 rounded" style={{ background: 'var(--skybook-gray-50)' }}>
                            <i className={`bi ${item.icon} fs-5`} style={{ color: 'var(--skybook-blue)' }}></i>
                            <div>
                              <small className="text-muted d-block">{item.label}</small>
                              <span className="fw-semibold">{item.value}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'baggage' && (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="p-4 rounded text-center" style={{ background: 'var(--skybook-gray-50)' }}>
                          <i className="bi bi-bag fs-1 d-block mb-2" style={{ color: 'var(--skybook-blue)' }}></i>
                          <h6 className="fw-bold">Cabin Baggage</h6>
                          <p className="fs-4 fw-bold mb-0" style={{ color: 'var(--skybook-blue)' }}>{flight.baggage?.cabin || '7 kg'}</p>
                          <small className="text-muted">Per passenger</small>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="p-4 rounded text-center" style={{ background: 'var(--skybook-gray-50)' }}>
                          <i className="bi bi-luggage fs-1 d-block mb-2" style={{ color: 'var(--skybook-blue)' }}></i>
                          <h6 className="fw-bold">Check-in Baggage</h6>
                          <p className="fs-4 fw-bold mb-0" style={{ color: 'var(--skybook-blue)' }}>{flight.baggage?.checkin || '15 kg'}</p>
                          <small className="text-muted">Per passenger</small>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'fare' && (
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className={`badge ${flight.refundable ? 'bg-success' : 'bg-danger'}`}>
                          {flight.refundable ? 'Refundable' : 'Non-Refundable'}
                        </span>
                      </div>
                      <div className="table-responsive">
                        <table className="table table-bordered small">
                          <tbody>
                            <tr><td className="fw-semibold">Cancellation Fee</td><td>₹{(flight.cancellationFee || 500).toLocaleString('en-IN')}</td></tr>
                            <tr><td className="fw-semibold">Date Change Fee</td><td>₹{((flight.cancellationFee || 500) * 0.6).toLocaleString('en-IN')}</td></tr>
                            <tr><td className="fw-semibold">No-Show Charge</td><td>Full fare</td></tr>
                            <tr><td className="fw-semibold">Cancellation Deadline</td><td>Up to 2 hours before departure</td></tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="text-muted small"><i className="bi bi-info-circle me-1"></i>These are sample fare rules for demonstration only.</p>
                    </div>
                  )}

                  {activeTab === 'amenities' && (
                    <div className="row g-3">
                      {(flight.amenities || ['In-flight Meals', 'Entertainment', 'USB Charging']).map((amenity, i) => {
                        const icons = {
                          'In-flight Meals': 'bi-cup-hot',
                          'Entertainment': 'bi-film',
                          'USB Charging': 'bi-plug',
                          'Wi-Fi': 'bi-wifi',
                          'Extra Legroom': 'bi-arrows-expand',
                          'Priority Boarding': 'bi-door-open',
                          'Lounge Access': 'bi-building',
                          'Reclining Seats': 'bi-arrows-angle-expand',
                        };
                        return (
                          <div className="col-md-4 col-6" key={i}>
                            <div className="p-3 rounded text-center" style={{ background: 'var(--skybook-gray-50)' }}>
                              <i className={`bi ${icons[amenity] || 'bi-check-circle'} fs-4 d-block mb-1`} style={{ color: 'var(--skybook-blue)' }}></i>
                              <small className="fw-semibold">{amenity}</small>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              {fare && <BookingSummary flight={flight} searchParams={activeParams} fareDetails={fare} />}
              <div className="mt-3">
                <button className="btn btn-skybook w-100 py-3" onClick={handleContinueBooking}>
                  <i className="bi bi-arrow-right-circle me-2"></i>Continue to Booking
                </button>
                <button className="btn btn-skybook-outline w-100 mt-2" onClick={() => navigate('/flights')}>
                  <i className="bi bi-arrow-left me-2"></i>Back to Results
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
