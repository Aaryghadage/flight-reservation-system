/**
 * FlightCard — displays a single flight result.
 *
 * Props:
 *  - flight        {object}   Flight data
 *  - searchParams  {object}   Current search parameters (for passenger counts)
 *  - onSelect      {function} Called with the flight when "Select" is clicked
 */
export default function FlightCard({ flight, searchParams, onSelect }) {
  if (!flight) return null;

  const airline = flight.airline || 'SkyBook Partner';
  const airlineCode = flight.airlineLogo || flight.airlineCode || flight.airline?.slice(0, 2)?.toUpperCase() || 'SB';
  const flightNumber = flight.flightNumber || '';
  const departureTime = flight.departureTime || '--:--';
  const arrivalTime = flight.arrivalTime || '--:--';
  
  const originCode = typeof flight.origin === 'object' ? flight.origin?.code : (flight.origin || '');
  const originCityName = typeof flight.origin === 'object' ? flight.origin?.city : (flight.originCity || '');
  
  const destCode = typeof flight.destination === 'object' ? flight.destination?.code : (flight.destination || '');
  const destCityName = typeof flight.destination === 'object' ? flight.destination?.city : (flight.destinationCity || '');
  
  const duration = flight.duration || '2h 00m';
  const stops = typeof flight.stops === 'number' ? flight.stops : 0;
  const stopLocations = Array.isArray(flight.stopDetails) 
    ? flight.stopDetails.map(s => s.code || s.city || s)
    : (Array.isArray(flight.stopLocations) ? flight.stopLocations : []);
    
  const price = typeof flight.price === 'number' ? flight.price : 4000;
  const seatsAvailable = typeof flight.seatsAvailable === 'number' ? flight.seatsAvailable : 20;
  const cabinClass = flight.cabinClass || searchParams?.cabinClass || 'Economy';
  
  const baggageStr = typeof flight.baggage === 'object' && flight.baggage !== null
    ? `${flight.baggage.cabin || '7 kg'} cabin · ${flight.baggage.checkin || '15 kg'} check-in`
    : (typeof flight.baggage === 'string' ? flight.baggage : '7 kg cabin · 15 kg check-in');
    
  const amenities = Array.isArray(flight.amenities) ? flight.amenities : [];

  /* ── passenger counts ─────────────────────────────────────────── */
  const adults = searchParams?.adults || 1;
  const children = searchParams?.children || 0;
  const infants = searchParams?.infants || 0;
  const totalPax = adults + children + infants;

  const adultFare = price * adults;
  const childFare = Math.round(price * 0.75) * children;
  const infantFare = Math.round(price * 0.1) * infants;
  const totalPrice = adultFare + childFare + infantFare;

  /* ── stops label ──────────────────────────────────────────────── */
  const stopsLabel =
    stops === 0 ? 'Nonstop' : stops === 1 ? '1 Stop' : `${stops} Stops`;
  const stopsColor =
    stops === 0 ? '#0d9488' : stops === 1 ? '#d97706' : '#dc2626';

  /* ── amenity icon map ─────────────────────────────────────────── */
  const amenityIcons = {
    wifi: 'bi-wifi',
    meals: 'bi-cup-hot',
    entertainment: 'bi-tv',
    power: 'bi-plug',
    usb: 'bi-usb-plug',
    blanket: 'bi-moon-stars',
    legroom: 'bi-arrows-expand',
  };

  /* ── cabin class badge color ──────────────────────────────────── */
  const cabinColors = {
    Economy: '#6b7280',
    'Premium Economy': '#0891b2',
    Business: '#7c3aed',
    'First Class': '#b45309',
  };

  return (
    <div
      className="card border-0 shadow-sm mb-3"
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
      }}
    >
      <div className="card-body p-3 p-md-4">
        <div className="d-flex flex-wrap align-items-center gap-3">
          {/* ── Airline badge ──────────────────────────────────── */}
          <div className="text-center flex-shrink-0" style={{ minWidth: '60px' }}>
            <div
              className="d-flex align-items-center justify-content-center mx-auto mb-1"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {airlineCode}
            </div>
            <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
              {flightNumber}
            </small>
          </div>

          {/* ── Route & times ──────────────────────────────────── */}
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 gap-md-3 mb-1">
              {/* Departure */}
              <div>
                <div className="fw-bold" style={{ fontSize: '1.2rem', color: '#0a1628' }}>
                  {departureTime}
                </div>
                <div className="text-muted" style={{ fontSize: '0.82rem' }}>
                  <span className="fw-bold text-dark">{originCode}</span>
                  {originCityName && (
                    <span className="d-none d-md-inline"> · {originCityName}</span>
                  )}
                </div>
              </div>

              {/* Connector */}
              <div className="flex-grow-1 text-center px-1 px-md-2">
                <small
                  className="d-block text-muted mb-1"
                  style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}
                >
                  {duration}
                </small>
                <div className="position-relative" style={{ height: '2px' }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '1px',
                    }}
                  />
                  {/* Stop dots */}
                  {stops > 0 &&
                    Array.from({ length: stops }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          position: 'absolute',
                          top: '-3px',
                          left: `${((i + 1) * 100) / (stops + 1)}%`,
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: stopsColor,
                          border: '2px solid #fff',
                          transform: 'translateX(-50%)',
                        }}
                        title={stopLocations[i] || ''}
                      />
                    ))}
                  {/* Arrow */}
                  <i
                    className="bi bi-caret-right-fill position-absolute"
                    style={{
                      top: '-6px',
                      right: '-2px',
                      fontSize: '0.7rem',
                      color: '#e5e7eb',
                    }}
                  ></i>
                </div>
                <small className="fw-semibold" style={{ fontSize: '0.75rem', color: stopsColor }}>
                  {stopsLabel}
                  {stopLocations.length > 0 && (
                    <span className="d-none d-lg-inline text-muted fw-normal">
                      {' '}
                      via {stopLocations.join(', ')}
                    </span>
                  )}
                </small>
              </div>

              {/* Arrival */}
              <div className="text-end">
                <div className="fw-bold" style={{ fontSize: '1.2rem', color: '#0a1628' }}>
                  {arrivalTime}
                </div>
                <div className="text-muted" style={{ fontSize: '0.82rem' }}>
                  <span className="fw-bold text-dark">{destCode}</span>
                  {destCityName && (
                    <span className="d-none d-md-inline"> · {destCityName}</span>
                  )}
                </div>
              </div>
            </div>

            {/* ── Bottom row: airline, class, baggage, amenities ─ */}
            <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
              <span className="text-muted small">{airline}</span>
              <span className="vr d-none d-md-inline" style={{ height: '14px' }}></span>
              <span
                className="badge"
                style={{
                  backgroundColor: cabinColors[cabinClass] || '#6b7280',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                }}
              >
                {cabinClass}
              </span>
              <span className="text-muted small d-none d-md-inline">
                <i className="bi bi-bag me-1"></i>
                {baggageStr}
              </span>
              {/* Amenity icons */}
              {amenities.length > 0 && (
                <span className="d-none d-lg-flex gap-1 ms-1">
                  {amenities.slice(0, 4).map((a) => (
                    <i
                      key={a}
                      className={`bi ${amenityIcons[a] || 'bi-check-circle'}`}
                      title={a}
                      style={{ fontSize: '0.8rem', color: '#6b7280' }}
                    ></i>
                  ))}
                </span>
              )}
            </div>
          </div>

          {/* ── Price & select button ──────────────────────────── */}
          <div className="text-end flex-shrink-0" style={{ minWidth: '130px' }}>
            <div className="fw-bold mb-0" style={{ fontSize: '1.35rem', color: '#2563eb' }}>
              ₹{price.toLocaleString('en-IN')}
            </div>
            <small className="text-muted d-block mb-1" style={{ fontSize: '0.75rem' }}>
              per adult ({cabinClass})
            </small>
            {totalPax > 1 && (
              <small className="text-muted d-block mb-2" style={{ fontSize: '0.78rem' }}>
                Total: ₹{totalPrice.toLocaleString('en-IN')} ({totalPax} pax)
              </small>
            )}
            {seatsAvailable > 0 && seatsAvailable <= 5 && (
              <small className="text-danger d-block mb-2" style={{ fontSize: '0.75rem' }}>
                <i className="bi bi-exclamation-circle me-1"></i>
                Only {seatsAvailable} seats left
              </small>
            )}
            <button
              className="btn btn-sm text-white w-100 fw-semibold"
              onClick={() => onSelect?.({
                ...flight,
                cabinClass,
                price,
                childPrice: Math.round(price * 0.75),
                infantPrice: Math.round(price * 0.1),
              })}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                borderRadius: '10px',
                border: 'none',
                padding: '8px 0',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Select Flight
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
