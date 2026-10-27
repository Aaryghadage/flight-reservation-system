import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

/**
 * Demo airports list — used across the search form.
 * If ../data/flights exports airports, you can swap this import.
 */
const airports = [
  { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi International Airport' },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International Airport' },
  { code: 'BLR', city: 'Bangalore', name: 'Kempegowda International Airport' },
  { code: 'MAA', city: 'Chennai', name: 'Chennai International Airport' },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose International Airport' },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International Airport' },
  { code: 'COK', city: 'Kochi', name: 'Cochin International Airport' },
  { code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel International Airport' },
  { code: 'GOX', city: 'Goa', name: 'Manohar International Airport' },
  { code: 'PNQ', city: 'Pune', name: 'Pune Airport' },
  { code: 'JAI', city: 'Jaipur', name: 'Jaipur International Airport' },
  { code: 'LKO', city: 'Lucknow', name: 'Chaudhary Charan Singh International Airport' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai International Airport' },
  { code: 'SIN', city: 'Singapore', name: 'Changi Airport' },
  { code: 'LHR', city: 'London', name: 'Heathrow Airport' },
];

const CABIN_CLASSES = ['Economy', 'Premium Economy', 'Business', 'First Class'];

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function getMaxDateStr() {
  const d = new Date();
  d.setMonth(d.getMonth() + 6);
  return d.toISOString().split('T')[0];
}

/**
 * FlightSearchForm — the main search widget.
 */
export default function FlightSearchForm({ compact = false, onSearch }) {
  const navigate = useNavigate();
  const { setSearchParams: saveSearch, searchParams: savedParams } = useBooking();

  const displayAirport = (code) => {
    const a = airports.find((ap) => ap.code === code);
    return a ? `${a.city} (${a.code})` : '';
  };

  const initialOrigin = savedParams?.origin || 'BOM';
  const initialDest = savedParams?.destination || 'DEL';

  /* ── form state ────────────────────────────────────────────────── */
  const [tripType, setTripType] = useState(savedParams?.tripType || 'one-way');
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDest);
  const [departDate, setDepartDate] = useState(savedParams?.departDate || getTodayStr());
  const [returnDate, setReturnDate] = useState(savedParams?.returnDate || '');
  const [adults, setAdults] = useState(savedParams?.adults || 1);
  const [children, setChildren] = useState(savedParams?.children || 0);
  const [infants, setInfants] = useState(savedParams?.infants || 0);
  const [cabinClass, setCabinClass] = useState(savedParams?.cabinClass || 'Economy');
  const [errors, setErrors] = useState({});

  /* ── origin / destination filter ───────────────────────────────── */
  const [originQuery, setOriginQuery] = useState(displayAirport(initialOrigin));
  const [destQuery, setDestQuery] = useState(displayAirport(initialDest));
  const [showOriginDD, setShowOriginDD] = useState(false);
  const [showDestDD, setShowDestDD] = useState(false);

  const resolveAirportCode = (code, query) => {
    if (code && airports.some((a) => a.code === code)) return code;
    if (!query) return '';
    const q = query.trim().toLowerCase();
    const found = airports.find(
      (a) =>
        a.code.toLowerCase() === q ||
        a.city.toLowerCase() === q ||
        a.name.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        q.includes(a.code.toLowerCase())
    );
    return found ? found.code : '';
  };

  const filterAirports = (q) => {
    if (!q) return airports;
    const lower = q.toLowerCase();
    return airports.filter(
      (a) =>
        a.city.toLowerCase().includes(lower) ||
        a.code.toLowerCase().includes(lower) ||
        a.name.toLowerCase().includes(lower)
    );
  };

  const filteredOrigins = useMemo(() => filterAirports(originQuery), [originQuery]);
  const filteredDests = useMemo(() => filterAirports(destQuery), [destQuery]);

  /* ── close dropdowns on outside click ─────────────────────────── */
  useEffect(() => {
    const handler = () => {
      setShowOriginDD(false);
      setShowDestDD(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  /* ── swap ───────────────────────────────────────────────────────── */
  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
    setOriginQuery(displayAirport(destination));
    setDestQuery(displayAirport(origin));
  };

  /* ── passenger counter helpers ──────────────────────────────────── */
  const inc = (setter, val, max) => () => setter(Math.min(val + 1, max));
  const dec = (setter, val, min) => () => setter(Math.max(val - 1, min));

  /* ── validation & submit ────────────────────────────────────────── */
  const validate = () => {
    const errs = {};
    const finalOrigin = resolveAirportCode(origin, originQuery);
    const finalDest = resolveAirportCode(destination, destQuery);

    if (!finalOrigin) errs.origin = 'Please select origin';
    if (!finalDest) errs.destination = 'Please select destination';
    if (finalOrigin && finalDest && finalOrigin === finalDest)
      errs.destination = 'Origin and destination must be different';
    if (!departDate) errs.departDate = 'Select departure date';
    if (tripType === 'round-trip') {
      if (!returnDate) errs.returnDate = 'Select return date';
      else if (returnDate < departDate) errs.returnDate = 'Return date must be after departure';
    }
    if (adults < 1) errs.adults = 'At least 1 adult required';
    if (infants > adults) errs.infants = 'Infants cannot exceed adults';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const finalOrigin = resolveAirportCode(origin, originQuery) || 'BOM';
    const finalDest = resolveAirportCode(destination, destQuery) || 'DEL';

    setOrigin(finalOrigin);
    setDestination(finalDest);

    const params = {
      tripType,
      origin: finalOrigin,         // airport code e.g. 'BOM'
      destination: finalDest,    // airport code e.g. 'DEL'
      departureDate: departDate,  // alias so flightService can read it
      departDate,
      returnDate: tripType === 'round-trip' ? returnDate : null,
      adults,
      children,
      infants,
      cabinClass,
    };

    saveSearch(params);
    onSearch?.(params);
    navigate('/flights');
  };

  /* ── airport dropdown renderer ──────────────────────────────────── */
  const renderAirportDropdown = (list, onSelect, show) => {
    if (!show || list.length === 0) return null;
    return (
      <div
        className="position-absolute w-100 bg-white border rounded-3 shadow-lg"
        style={{ zIndex: 1060, maxHeight: '250px', overflowY: 'auto', top: '100%', left: 0 }}
      >
        {list.map((a) => (
          <button
            key={a.code}
            type="button"
            className="dropdown-item px-3 py-2 d-flex justify-content-between align-items-center"
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(a);
            }}
          >
            <div>
              <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>
                {a.city}
              </div>
              <small className="text-muted" style={{ fontSize: '0.78rem' }}>
                {a.name}
              </small>
            </div>
            <span
              className="badge text-white"
              style={{ backgroundColor: '#2563eb', fontSize: '0.75rem' }}
            >
              {a.code}
            </span>
          </button>
        ))}
      </div>
    );
  };

  /* ── render ─────────────────────────────────────────────────────── */

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="card border-0 shadow-lg"
        style={{
          borderRadius: '20px',
          overflow: 'hidden',
          background: compact
            ? '#fff'
            : 'linear-gradient(135deg, rgba(255,255,255,0.97), rgba(255,255,255,0.93))',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="card-body p-4">
          {/* ── Trip type ──────────────────────────────────────── */}
          <div className="d-flex gap-3 mb-4">
            {['one-way', 'round-trip'].map((t) => (
              <div className="form-check" key={t}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="tripType"
                  id={`trip-${t}`}
                  value={t}
                  checked={tripType === t}
                  onChange={() => setTripType(t)}
                  style={{ borderColor: '#2563eb' }}
                />
                <label
                  className="form-check-label fw-medium"
                  htmlFor={`trip-${t}`}
                  style={{ cursor: 'pointer', fontSize: '0.92rem' }}
                >
                  {t === 'one-way' ? 'One Way' : 'Round Trip'}
                </label>
              </div>
            ))}
          </div>

          <div className="row g-3">
            {/* ── Origin ───────────────────────────────────────── */}
            <div className="col-md-5 col-lg position-relative">
              <label className="form-label fw-semibold small text-muted">
                <i className="bi bi-geo-alt me-1"></i>From
              </label>
              <input
                type="text"
                className={`form-control form-control-lg ${errors.origin ? 'is-invalid' : ''}`}
                placeholder="City or Airport"
                value={originQuery || displayAirport(origin)}
                onChange={(e) => {
                  setOriginQuery(e.target.value);
                  setShowOriginDD(true);
                  if (!e.target.value) setOrigin('');
                }}
                onFocus={(e) => {
                  e.stopPropagation();
                  setShowOriginDD(true);
                  setOriginQuery('');
                }}
                onClick={(e) => e.stopPropagation()}
                style={{ borderRadius: '12px', fontSize: '0.95rem' }}
              />
              {errors.origin && <div className="invalid-feedback">{errors.origin}</div>}
              {renderAirportDropdown(
                filteredOrigins,
                (a) => {
                  setOrigin(a.code);
                  setOriginQuery(`${a.city} (${a.code})`);
                  setShowOriginDD(false);
                },
                showOriginDD
              )}
            </div>

            {/* ── Swap button ──────────────────────────────────── */}
            <div
              className="col-auto d-flex align-items-end pb-1 d-none d-md-flex"
              style={{ marginBottom: '2px' }}
            >
              <button
                type="button"
                className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                onClick={handleSwap}
                title="Swap origin & destination"
                style={{ width: '42px', height: '42px', borderColor: '#2563eb' }}
              >
                <i className="bi bi-arrow-left-right"></i>
              </button>
            </div>

            {/* ── Destination ──────────────────────────────────── */}
            <div className="col-md-5 col-lg position-relative">
              <label className="form-label fw-semibold small text-muted">
                <i className="bi bi-geo-alt-fill me-1"></i>To
              </label>
              <input
                type="text"
                className={`form-control form-control-lg ${errors.destination ? 'is-invalid' : ''}`}
                placeholder="City or Airport"
                value={destQuery || displayAirport(destination)}
                onChange={(e) => {
                  setDestQuery(e.target.value);
                  setShowDestDD(true);
                  if (!e.target.value) setDestination('');
                }}
                onFocus={(e) => {
                  e.stopPropagation();
                  setShowDestDD(true);
                  setDestQuery('');
                }}
                onClick={(e) => e.stopPropagation()}
                style={{ borderRadius: '12px', fontSize: '0.95rem' }}
              />
              {errors.destination && <div className="invalid-feedback">{errors.destination}</div>}
              {renderAirportDropdown(
                filteredDests,
                (a) => {
                  setDestination(a.code);
                  setDestQuery(`${a.city} (${a.code})`);
                  setShowDestDD(false);
                },
                showDestDD
              )}
            </div>

            {/* Mobile swap button */}
            <div className="col-12 d-md-none text-center">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm rounded-pill px-3"
                onClick={handleSwap}
              >
                <i className="bi bi-arrow-down-up me-1"></i>Swap
              </button>
            </div>
          </div>

          <div className="row g-3 mt-1">
            {/* ── Departure date ───────────────────────────────── */}
            <div className="col-md-6 col-lg-3">
              <label className="form-label fw-semibold small text-muted">
                <i className="bi bi-calendar3 me-1"></i>Departure
              </label>
              <input
                type="date"
                className={`form-control ${errors.departDate ? 'is-invalid' : ''}`}
                value={departDate}
                min={getTodayStr()}
                max={getMaxDateStr()}
                onChange={(e) => setDepartDate(e.target.value)}
                style={{ borderRadius: '12px' }}
              />
              {errors.departDate && <div className="invalid-feedback">{errors.departDate}</div>}
            </div>

            {/* ── Return date (round-trip only) ────────────────── */}
            {tripType === 'round-trip' && (
              <div className="col-md-6 col-lg-3">
                <label className="form-label fw-semibold small text-muted">
                  <i className="bi bi-calendar3 me-1"></i>Return
                </label>
                <input
                  type="date"
                  className={`form-control ${errors.returnDate ? 'is-invalid' : ''}`}
                  value={returnDate}
                  min={departDate || getTodayStr()}
                  max={getMaxDateStr()}
                  onChange={(e) => setReturnDate(e.target.value)}
                  style={{ borderRadius: '12px' }}
                />
                {errors.returnDate && <div className="invalid-feedback">{errors.returnDate}</div>}
              </div>
            )}

            {/* ── Passengers ───────────────────────────────────── */}
            <div className={`col-md-6 ${tripType === 'round-trip' ? 'col-lg-3' : 'col-lg-4'}`}>
              <label className="form-label fw-semibold small text-muted">
                <i className="bi bi-people me-1"></i>Passengers
              </label>
              <div className="d-flex gap-2 flex-wrap">
                {/* Adults */}
                <div className="d-flex flex-column align-items-center">
                  <small className="text-muted mb-1" style={{ fontSize: '0.72rem' }}>
                    Adults
                  </small>
                  <div className="btn-group btn-group-sm" role="group">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={dec(setAdults, adults, 1)}
                      disabled={adults <= 1}
                    >
                      −
                    </button>
                    <span
                      className="btn btn-light disabled fw-semibold"
                      style={{ minWidth: '32px', cursor: 'default' }}
                    >
                      {adults}
                    </span>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={inc(setAdults, adults, 9)}
                      disabled={adults >= 9}
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Children */}
                <div className="d-flex flex-column align-items-center">
                  <small className="text-muted mb-1" style={{ fontSize: '0.72rem' }}>
                    Children
                  </small>
                  <div className="btn-group btn-group-sm" role="group">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={dec(setChildren, children, 0)}
                      disabled={children <= 0}
                    >
                      −
                    </button>
                    <span
                      className="btn btn-light disabled fw-semibold"
                      style={{ minWidth: '32px', cursor: 'default' }}
                    >
                      {children}
                    </span>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={inc(setChildren, children, 9)}
                      disabled={children >= 9}
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Infants */}
                <div className="d-flex flex-column align-items-center">
                  <small className="text-muted mb-1" style={{ fontSize: '0.72rem' }}>
                    Infants
                  </small>
                  <div className="btn-group btn-group-sm" role="group">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={dec(setInfants, infants, 0)}
                      disabled={infants <= 0}
                    >
                      −
                    </button>
                    <span
                      className="btn btn-light disabled fw-semibold"
                      style={{ minWidth: '32px', cursor: 'default' }}
                    >
                      {infants}
                    </span>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={inc(setInfants, infants, 4)}
                      disabled={infants >= 4}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              {errors.adults && (
                <div className="text-danger small mt-1">{errors.adults}</div>
              )}
              {errors.infants && (
                <div className="text-danger small mt-1">{errors.infants}</div>
              )}
            </div>

            {/* ── Cabin class ──────────────────────────────────── */}
            <div className={`col-md-6 ${tripType === 'round-trip' ? 'col-lg-3' : 'col-lg-3'}`}>
              <label className="form-label fw-semibold small text-muted">
                <i className="bi bi-star me-1"></i>Cabin Class
              </label>
              <select
                className="form-select"
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
                style={{ borderRadius: '12px' }}
              >
                {CABIN_CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Submit ─────────────────────────────────────────── */}
          <div className="mt-4 text-center">
            <button
              type="submit"
              className="btn btn-lg text-white px-5 py-2 fw-semibold"
              style={{
                background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                borderRadius: '50px',
                border: 'none',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(37,99,235,0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(37,99,235,0.35)';
              }}
            >
              <i className="bi bi-search me-2"></i>Search Flights
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
