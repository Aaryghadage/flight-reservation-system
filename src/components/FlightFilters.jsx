import { useState } from 'react';

/**
 * FlightFilters — filter sidebar for flight search results.
 *
 * Props:
 *  - flights         {array}    All unfiltered flights
 *  - filters         {object}   Current filter state
 *  - onFilterChange  {function} Called with updated filters
 *  - airlines        {array}    List of unique airline names
 */
export default function FlightFilters({ flights = [], filters = {}, onFilterChange, airlines = [] }) {
  const [collapsed, setCollapsed] = useState({});

  /* ── price range from flights ──────────────────────────────────── */
  const prices = flights.map((f) => f.price || 0);
  const minFlightPrice = prices.length ? Math.min(...prices) : 0;
  const maxFlightPrice = prices.length ? Math.max(...prices) : 50000;

  const {
    priceMin = minFlightPrice,
    priceMax = maxFlightPrice,
    selectedAirlines = [],
    stops = 'any',
    departureTime = 'any',
  } = filters;

  /* ── emit updated filters ──────────────────────────────────────── */
  const update = (patch) => {
    onFilterChange?.({ ...filters, ...patch });
  };

  /* ── toggle section ────────────────────────────────────────────── */
  const toggleSection = (key) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  /* ── airline checkbox toggle ───────────────────────────────────── */
  const toggleAirline = (name) => {
    const current = [...selectedAirlines];
    const idx = current.indexOf(name);
    if (idx >= 0) current.splice(idx, 1);
    else current.push(name);
    update({ selectedAirlines: current });
  };

  /* ── reset ─────────────────────────────────────────────────────── */
  const resetFilters = () => {
    onFilterChange?.({
      priceMin: minFlightPrice,
      priceMax: maxFlightPrice,
      selectedAirlines: [],
      stops: 'any',
      departureTime: 'any',
      cabinClass: 'all',
    });
  };

  /* ── section renderer helper ───────────────────────────────────── */
  const SectionHeader = ({ id, icon, title }) => (
    <button
      type="button"
      className="btn btn-link text-decoration-none w-100 d-flex justify-content-between align-items-center p-0 mb-2"
      onClick={() => toggleSection(id)}
      style={{ color: '#0a1628' }}
    >
      <span className="fw-semibold" style={{ fontSize: '0.92rem' }}>
        <i className={`bi ${icon} me-2 text-primary`}></i>
        {title}
      </span>
      <i className={`bi ${collapsed[id] ? 'bi-chevron-down' : 'bi-chevron-up'}`}
        style={{ fontSize: '0.75rem' }}
      ></i>
    </button>
  );

  return (
    <div
      className="card border-0 shadow-sm"
      style={{ borderRadius: '16px', overflow: 'hidden', position: 'sticky', top: '80px' }}
    >
      <div className="card-body p-3">
        {/* ── Header ────────────────────────────────────────────── */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0" style={{ color: '#0a1628' }}>
            <i className="bi bi-funnel me-2"></i>Filters
          </h6>
          <button
            type="button"
            className="btn btn-link btn-sm text-decoration-none p-0"
            onClick={resetFilters}
            style={{ color: '#2563eb', fontSize: '0.82rem' }}
          >
            Reset All
          </button>
        </div>

        <hr className="my-2" />

        {/* ── Price range ───────────────────────────────────────── */}
        <div className="mb-3">
          <SectionHeader id="price" icon="bi-currency-rupee" title="Price Range" />
          {!collapsed.price && (
            <div className="px-1">
              <div className="d-flex justify-content-between small text-muted mb-2">
                <span>₹{priceMin.toLocaleString('en-IN')}</span>
                <span>₹{priceMax.toLocaleString('en-IN')}</span>
              </div>

              <label className="form-label small mb-1">Min Price</label>
              <input
                type="range"
                className="form-range"
                min={minFlightPrice}
                max={maxFlightPrice}
                step={100}
                value={priceMin}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  update({ priceMin: Math.min(val, priceMax) });
                }}
              />

              <label className="form-label small mb-1">Max Price</label>
              <input
                type="range"
                className="form-range"
                min={minFlightPrice}
                max={maxFlightPrice}
                step={100}
                value={priceMax}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  update({ priceMax: Math.max(val, priceMin) });
                }}
              />

              <div className="d-flex gap-2 mt-1">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={priceMin}
                  onChange={(e) =>
                    update({ priceMin: Math.min(Number(e.target.value) || 0, priceMax) })
                  }
                  style={{ borderRadius: '8px', fontSize: '0.82rem' }}
                />
                <span className="text-muted align-self-center">–</span>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={priceMax}
                  onChange={(e) =>
                    update({ priceMax: Math.max(Number(e.target.value) || 0, priceMin) })
                  }
                  style={{ borderRadius: '8px', fontSize: '0.82rem' }}
                />
              </div>
            </div>
          )}
        </div>

        <hr className="my-2" />

        {/* ── Airlines ──────────────────────────────────────────── */}
        {airlines.length > 0 && (
          <>
            <div className="mb-3">
              <SectionHeader id="airlines" icon="bi-buildings" title="Airlines" />
              {!collapsed.airlines && (
                <div className="px-1" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                  {airlines.map((name) => (
                    <div className="form-check mb-1" key={name}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`airline-${name}`}
                        checked={selectedAirlines.includes(name)}
                        onChange={() => toggleAirline(name)}
                      />
                      <label
                        className="form-check-label small"
                        htmlFor={`airline-${name}`}
                        style={{ cursor: 'pointer' }}
                      >
                        {name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <hr className="my-2" />
          </>
        )}

        {/* ── Cabin Class ───────────────────────────────────────── */}
        <div className="mb-3">
          <SectionHeader id="cabinClass" icon="bi-award" title="Cabin Class" />
          {!collapsed.cabinClass && (
            <div className="px-1 d-flex flex-column gap-1">
              {[
                { value: 'all', label: 'All / Current' },
                { value: 'Economy', label: 'Economy (1x)' },
                { value: 'Premium Economy', label: 'Premium Economy (1.5x)' },
                { value: 'Business', label: 'Business (2.5x)' },
                { value: 'First Class', label: 'First Class (4x)' },
              ].map(({ value: v, label }) => (
                <div className="form-check" key={v}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="cabinClassFilter"
                    id={`cabin-${v}`}
                    checked={(filters.cabinClass || 'all') === v}
                    onChange={() => update({ cabinClass: v })}
                  />
                  <label
                    className="form-check-label small"
                    htmlFor={`cabin-${v}`}
                    style={{ cursor: 'pointer' }}
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <hr className="my-2" />

        {/* ── Stops ─────────────────────────────────────────────── */}
        <div className="mb-3">
          <SectionHeader id="stops" icon="bi-signpost-2" title="Stops" />
          {!collapsed.stops && (
            <div className="px-1 d-flex flex-column gap-1">
              {[
                { value: 'any', label: 'Any' },
                { value: '0', label: 'Nonstop' },
                { value: '1', label: '1 Stop' },
                { value: '2+', label: '2+ Stops' },
              ].map(({ value: v, label }) => (
                <div className="form-check" key={v}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="stops"
                    id={`stop-${v}`}
                    checked={stops === v}
                    onChange={() => update({ stops: v })}
                  />
                  <label
                    className="form-check-label small"
                    htmlFor={`stop-${v}`}
                    style={{ cursor: 'pointer' }}
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <hr className="my-2" />

        {/* ── Departure time ────────────────────────────────────── */}
        <div className="mb-2">
          <SectionHeader id="deptime" icon="bi-clock" title="Departure Time" />
          {!collapsed.deptime && (
            <div className="px-1 d-flex flex-column gap-1">
              {[
                { value: 'any', label: 'Any Time', icon: 'bi-clock' },
                { value: 'morning', label: 'Morning (6–12)', icon: 'bi-sunrise' },
                { value: 'afternoon', label: 'Afternoon (12–18)', icon: 'bi-sun' },
                { value: 'evening', label: 'Evening (18–24)', icon: 'bi-sunset' },
                { value: 'night', label: 'Night (0–6)', icon: 'bi-moon' },
              ].map(({ value: v, label, icon }) => (
                <div className="form-check" key={v}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="deptime"
                    id={`dep-${v}`}
                    checked={departureTime === v}
                    onChange={() => update({ departureTime: v })}
                  />
                  <label
                    className="form-check-label small"
                    htmlFor={`dep-${v}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className={`bi ${icon} me-1`}></i>
                    {label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
