/**
 * BookingSummary — fare breakdown sidebar / card.
 *
 * Props:
 *  - flight          {object}  Selected flight
 *  - searchParams    {object}  Search parameters (passenger counts)
 *  - fareDetails     {object}  Pre-calculated fare breakdown (optional override)
 *  - couponCode      {string}  Applied coupon code
 *  - couponDiscount  {number}  Discount amount from coupon
 */
export default function BookingSummary({
  flight,
  searchParams,
  fareDetails: externalFare,
  couponCode,
  couponDiscount = 0,
}) {
  if (!flight) return null;

  const adults = searchParams?.adults || 1;
  const children = searchParams?.children || 0;
  const infants = searchParams?.infants || 0;
  const currentCabin = searchParams?.cabinClass || flight.cabinClass || 'Economy';

  /* ── Compute fare if not provided externally ───────────────────── */
  const adultPrice = externalFare?.adultPrice ?? externalFare?.adults?.pricePerPerson ?? flight.price;
  const adultFare = externalFare?.adultFare ?? externalFare?.adults?.total ?? (adultPrice * adults);
  const childPrice = externalFare?.childPrice ?? externalFare?.children?.pricePerPerson ?? Math.round(adultPrice * 0.75);
  const childFare = externalFare?.childFare ?? externalFare?.children?.total ?? (childPrice * children);
  const infantPrice = externalFare?.infantPrice ?? externalFare?.infants?.pricePerPerson ?? Math.round(adultPrice * 0.1);
  const infantFare = externalFare?.infantFare ?? externalFare?.infants?.total ?? (infantPrice * infants);
  const baseFare = externalFare?.baseFare ?? (adultFare + childFare + infantFare);
  const taxes = externalFare?.taxes ?? Math.round(baseFare * 0.12);
  const discount = externalFare?.discount ?? couponDiscount;
  const grandTotal = externalFare?.grandTotal ?? (baseFare + taxes - discount);

  const fmt = (n) => `₹${(n || 0).toLocaleString('en-IN')}`;

  /* ── helper to format date ─────────────────────────────────────── */
  const fmtDate = (d) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return d;
    }
  };

  const originCity = typeof flight.origin === 'object' && flight.origin !== null
    ? (flight.origin.city || flight.origin.code || '')
    : (flight.originCity || flight.origin || '');
  const destCity = typeof flight.destination === 'object' && flight.destination !== null
    ? (flight.destination.city || flight.destination.code || '')
    : (flight.destinationCity || flight.destination || '');

  return (
    <div
      className="card border-0 shadow-sm"
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'sticky',
        top: '80px',
      }}
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <div
        className="card-header border-0 text-white py-3 px-4"
        style={{
          background: 'linear-gradient(135deg, #0a1628, #1e3a5f)',
        }}
      >
        <h6 className="mb-0 fw-bold d-flex justify-content-between align-items-center">
          <span><i className="bi bi-receipt me-2"></i>Fare Summary</span>
          <span className="badge bg-light text-dark fw-semibold" style={{ fontSize: '0.75rem' }}>{currentCabin}</span>
        </h6>
      </div>

      <div className="card-body p-4">
        {/* ── Flight info ───────────────────────────────────────── */}
        <div className="mb-3 pb-3 border-bottom">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="fw-semibold" style={{ color: '#0a1628' }}>
              {originCity} → {destCity}
            </span>
          </div>
          <div className="d-flex flex-wrap gap-2 small text-muted">
            <span>
              <i className="bi bi-calendar3 me-1"></i>
              {fmtDate(searchParams?.departDate || searchParams?.departureDate)}
            </span>
            <span className="vr" style={{ height: '14px' }}></span>
            <span>{flight.airline}</span>
            <span className="vr" style={{ height: '14px' }}></span>
            <span>{flight.flightNumber}</span>
          </div>
          <div className="small text-muted mt-1">
            <i className="bi bi-clock me-1"></i>
            {flight.departureTime} – {flight.arrivalTime}
            <span className="ms-2">{flight.duration}</span>
          </div>
        </div>

        {/* ── Fare breakdown ────────────────────────────────────── */}
        <div className="mb-3">
          {adults > 0 && (
            <div className="d-flex justify-content-between small mb-2">
              <span className="text-muted">
                Adults ({adults} × {fmt(adultPrice)})
              </span>
              <span className="fw-medium">{fmt(adultFare)}</span>
            </div>
          )}
          {children > 0 && (
            <div className="d-flex justify-content-between small mb-2">
              <span className="text-muted">
                Children ({children} × {fmt(childPrice)})
              </span>
              <span className="fw-medium">{fmt(childFare)}</span>
            </div>
          )}
          {infants > 0 && (
            <div className="d-flex justify-content-between small mb-2">
              <span className="text-muted">
                Infants ({infants} × {fmt(infantPrice)})
              </span>
              <span className="fw-medium">{fmt(infantFare)}</span>
            </div>
          )}

          <hr className="my-2" />

          <div className="d-flex justify-content-between small mb-2">
            <span className="text-muted">Base Fare</span>
            <span className="fw-medium">{fmt(baseFare)}</span>
          </div>
          <div className="d-flex justify-content-between small mb-2">
            <span className="text-muted">
              Taxes & Fees (12%)
            </span>
            <span className="fw-medium">{fmt(taxes)}</span>
          </div>

          {discount > 0 && (
            <div className="d-flex justify-content-between small mb-2 text-success">
              <span>
                <i className="bi bi-tag-fill me-1"></i>
                Coupon ({couponCode || 'Applied'})
              </span>
              <span className="fw-semibold">−{fmt(discount)}</span>
            </div>
          )}
        </div>

        {/* ── Grand Total ───────────────────────────────────────── */}
        <div
          className="d-flex justify-content-between align-items-center p-3 rounded-3"
          style={{ backgroundColor: '#f0f7ff' }}
        >
          <span className="fw-bold" style={{ color: '#0a1628' }}>
            Grand Total
          </span>
          <span className="fw-bold" style={{ fontSize: '1.35rem', color: '#2563eb' }}>
            {fmt(grandTotal)}
          </span>
        </div>

        {/* ── Note ──────────────────────────────────────────────── */}
        <p
          className="text-muted text-center mt-3 mb-0"
          style={{ fontSize: '0.72rem', lineHeight: 1.5 }}
        >
          <i className="bi bi-info-circle me-1"></i>
          All prices in INR (₹). Includes applicable taxes.
          <br />
          This is a demo — no real charges apply.
        </p>
      </div>
    </div>
  );
}
