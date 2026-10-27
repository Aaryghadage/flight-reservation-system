import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FlightSearchForm from '../components/FlightSearchForm';
import FlightCard from '../components/FlightCard';
import FlightFilters from '../components/FlightFilters';
import EmptyState from '../components/EmptyState';
import { FlightCardSkeleton } from '../components/LoadingSkeleton';
import { searchFlights, filterFlights, sortFlights, getAvailableAirlines } from '../services/flightService';

export default function Flights() {
  const navigate = useNavigate();
  const { searchParams, selectFlight, setSearchParams } = useBooking();

  const [loading, setLoading] = useState(true);
  const [allFlights, setAllFlights] = useState([]);
  const [sortBy, setSortBy] = useState('price_asc');
  const [showModify, setShowModify] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState({
    selectedAirlines: [],
    airlines: [],
    stops: 'any',
    departureTime: 'any',
    cabinClass: searchParams?.cabinClass || 'all',
    priceMin: 0,
    priceMax: 100000,
  });

  useEffect(() => {
    if (searchParams?.cabinClass) {
      setFilters((prev) => ({ ...prev, cabinClass: searchParams.cabinClass }));
    }
  }, [searchParams?.cabinClass]);

  // Search flights on mount or when searchParams change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      try {
        const results = searchFlights(searchParams);
        setAllFlights(results);
      } catch (err) {
        setAllFlights([]);
      }
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  // Filter and sort flights
  const processedFlights = useMemo(() => {
    let results = [...allFlights];
    results = filterFlights(results, filters);
    results = sortFlights(results, sortBy);
    return results;
  }, [allFlights, filters, sortBy]);

  const availableAirlines = useMemo(() => {
    return getAvailableAirlines(allFlights);
  }, [allFlights]);

  const handleSelectFlight = (flight) => {
    selectFlight(flight);
    if (searchParams && flight.cabinClass && flight.cabinClass !== searchParams.cabinClass) {
      setSearchParams({
        ...searchParams,
        cabinClass: flight.cabinClass,
      });
    }
    navigate(`/flight-details/${flight.id}`);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const searchSummary = searchParams ? (
    <span>
      <strong className="text-white">{searchParams.origin || searchParams.from || 'All Origins'}</strong>
      <i className="bi bi-arrow-right mx-2 text-white"></i>
      <strong className="text-white">{searchParams.destination || searchParams.to || 'All Destinations'}</strong>
      {(searchParams.departureDate || searchParams.departDate) && (
        <span className="ms-2 text-white-50">| {searchParams.departureDate || searchParams.departDate}</span>
      )}
      <span className="ms-2 text-white-50">
        | {searchParams.adults || 1} Adult{(searchParams.adults || 1) > 1 ? 's' : ''}
        {(searchParams.children || 0) > 0 ? `, ${searchParams.children} Child` : ''}
        {(searchParams.infants || 0) > 0 ? `, ${searchParams.infants} Infant` : ''}
      </span>
      {searchParams.cabinClass && <span className="ms-2 text-white-50">| {searchParams.cabinClass}</span>}
    </span>
  ) : null;

  return (
    <div className="skybook-flights">
      <Navbar />

      <div className="bg-primary text-white py-3">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <i className="bi bi-airplane fs-4 me-2"></i>
              <div>{searchSummary || 'All Available Flights'}</div>
            </div>
            <button
              className="btn btn-outline-light btn-sm rounded-pill mt-2 mt-md-0"
              onClick={() => setShowModify(!showModify)}
            >
              <i className="bi bi-pencil-square me-1"></i>
              {showModify ? 'Hide' : 'Modify Search'}
            </button>
          </div>
        </div>
      </div>

      {/* Modify Search Collapse */}
      {showModify && (
        <div className="bg-light border-bottom py-3">
          <div className="container">
            <FlightSearchForm onSearch={() => setShowModify(false)} />
          </div>
        </div>
      )}

      <div className="container py-4">
        <div className="row">
          {/* Desktop Filters Sidebar */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="sticky-top" style={{ top: '80px' }}>
              <FlightFilters
                flights={allFlights}
                airlines={availableAirlines}
                filters={filters}
                onFilterChange={handleFilterChange}
                totalResults={processedFlights.length}
              />
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="col-12 d-lg-none mb-3">
            <button
              className="btn btn-outline-primary w-100 rounded-pill"
              onClick={() => setShowMobileFilters(true)}
            >
              <i className="bi bi-funnel me-2"></i> Filters
              {(filters.airlines.length > 0 || filters.stops.length > 0) && (
                <span className="badge bg-primary ms-2">Active</span>
              )}
            </button>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {/* Quick Cabin Class Filter Pills */}
            <div className="d-flex align-items-center gap-2 mb-3 overflow-auto pb-1">
              <span className="small text-muted fw-semibold me-1 text-nowrap">
                <i className="bi bi-award me-1"></i>Class:
              </span>
              {[
                { value: 'all', label: 'All Classes' },
                { value: 'Economy', label: 'Economy (1x)' },
                { value: 'Premium Economy', label: 'Premium Economy (1.5x)' },
                { value: 'Business', label: 'Business (2.5x)' },
                { value: 'First Class', label: 'First Class (4x)' },
              ].map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 text-nowrap ${
                    (filters.cabinClass || 'all') === c.value
                      ? 'btn-primary shadow-sm'
                      : 'btn-outline-secondary bg-white'
                  }`}
                  onClick={() => {
                    handleFilterChange({ ...filters, cabinClass: c.value });
                    if (c.value !== 'all' && searchParams) {
                      setSearchParams({ ...searchParams, cabinClass: c.value });
                    }
                  }}
                  style={{ fontSize: '0.82rem' }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Sort Bar */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
              <p className="mb-0 text-muted">
                {loading ? 'Searching...' : `${processedFlights.length} flight${processedFlights.length !== 1 ? 's' : ''} found`}
              </p>
              <div className="d-flex align-items-center gap-2">
                <label className="form-label mb-0 text-muted small">Sort by:</label>
                <select
                  className="form-select form-select-sm rounded-pill"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  <option value="price_asc">Cheapest First</option>
                  <option value="price_desc">Most Expensive</option>
                  <option value="duration_asc">Fastest First</option>
                  <option value="departure_asc">Earliest Departure</option>
                  <option value="departure_desc">Latest Departure</option>
                </select>
              </div>
            </div>

            {/* Flight Results */}
            {loading ? (
              <div>
                {Array.from({ length: 4 }).map((_, i) => (
                  <FlightCardSkeleton key={i} />
                ))}
              </div>
            ) : processedFlights.length === 0 ? (
              <EmptyState
                icon="bi-airplane"
                title="No Flights Found"
                message="We couldn't find any flights matching your search criteria. Try adjusting your filters or search for different dates."
                actionLabel="Clear Filters"
                onAction={() =>
                  setFilters({
                    selectedAirlines: [],
                    airlines: [],
                    stops: 'any',
                    departureTime: 'any',
                    priceMin: 0,
                    priceMax: 100000,
                  })
                }
              />
            ) : (
              <div>
                {processedFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    searchParams={searchParams}
                    onSelect={handleSelectFlight}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Offcanvas */}
      {showMobileFilters && (
        <>
          <div className="offcanvas-backdrop fade show" onClick={() => setShowMobileFilters(false)}></div>
          <div className="offcanvas offcanvas-start show" tabIndex="-1" style={{ visibility: 'visible' }}>
            <div className="offcanvas-header">
              <h5 className="offcanvas-title fw-bold">Filters</h5>
              <button type="button" className="btn-close" onClick={() => setShowMobileFilters(false)}></button>
            </div>
            <div className="offcanvas-body">
              <FlightFilters
                flights={allFlights}
                airlines={availableAirlines}
                filters={filters}
                onFilterChange={(f) => { handleFilterChange(f); }}
                totalResults={processedFlights.length}
              />
              <button
                className="btn btn-primary w-100 mt-3 rounded-pill"
                onClick={() => setShowMobileFilters(false)}
              >
                Show {processedFlights.length} Results
              </button>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
